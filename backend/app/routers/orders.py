from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models import Medicine, Order, OrderItem, OrderStatus, Prescription, User
from ..schemas import OrderCreate, OrderOut
from ..s3_service import upload_image_to_s3
from .auth import get_current_user


router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/upload-prescription")
async def upload_prescription(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    return {"url": await upload_image_to_s3(file, f"prescriptions/user-{current_user.id}")}


@router.post("", response_model=OrderOut, status_code=201)
def create_order(payload: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one medicine")

    total = 0.0
    item_rows: list[OrderItem] = []
    for item in payload.items:
        medicine = db.get(Medicine, item.medicine_id)
        if not medicine:
            raise HTTPException(status_code=404, detail=f"Medicine {item.medicine_id} not found")
        if medicine.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {medicine.name}")
        total += medicine.price * item.quantity
        item_rows.append(OrderItem(medicine_id=medicine.id, quantity=item.quantity, unit_price=medicine.price))

    order = Order(
        user_id=current_user.id,
        status=OrderStatus.pending_verification,
        total_amount=round(total, 2),
        shipping_address=payload.shipping_address,
        items=item_rows,
        prescription=Prescription(image_url=payload.prescription_url),
    )
    db.add(order)
    db.commit()
    return (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.medicine), joinedload(Order.prescription), joinedload(Order.user))
        .filter(Order.id == order.id)
        .one()
    )


@router.get("", response_model=list[OrderOut])
def my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.medicine), joinedload(Order.prescription))
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.post("/{order_id}/cancel", response_model=OrderOut)
def cancel_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.medicine), joinedload(Order.prescription))
        .filter(Order.id == order_id, Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status in {OrderStatus.dispatched, OrderStatus.delivered, OrderStatus.cancelled}:
        raise HTTPException(status_code=400, detail="Order cannot be cancelled at this stage")
    order.status = OrderStatus.cancelled
    db.commit()
    db.refresh(order)
    return order

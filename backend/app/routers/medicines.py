from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Medicine
from ..schemas import MedicineCreate, MedicineOut, MedicineUpdate
from .auth import require_admin
from ..s3_service import upload_image_to_s3


router = APIRouter(prefix="/medicines", tags=["medicines"])


@router.get("", response_model=list[MedicineOut])
def list_medicines(
    search: str | None = None,
    category: str | None = None,
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Medicine)
    if search:
        query = query.filter(Medicine.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(Medicine.category == category)
    if min_price is not None:
        query = query.filter(Medicine.price >= min_price)
    if max_price is not None:
        query = query.filter(Medicine.price <= max_price)
    return query.order_by(Medicine.name.asc()).all()


@router.get("/{medicine_id}", response_model=MedicineOut)
def get_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.get(Medicine, medicine_id)
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine


@router.post("", response_model=MedicineOut, dependencies=[Depends(require_admin)], status_code=201)
def create_medicine(payload: MedicineCreate, db: Session = Depends(get_db)):
    medicine = Medicine(**payload.model_dump())
    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return medicine


@router.put("/{medicine_id}", response_model=MedicineOut, dependencies=[Depends(require_admin)])
def update_medicine(medicine_id: int, payload: MedicineUpdate, db: Session = Depends(get_db)):
    medicine = db.get(Medicine, medicine_id)
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(medicine, key, value)
    db.commit()
    db.refresh(medicine)
    return medicine


@router.delete("/{medicine_id}", dependencies=[Depends(require_admin)], status_code=204)
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.get(Medicine, medicine_id)
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(medicine)
    db.commit()
    return None


@router.post("/upload-image", dependencies=[Depends(require_admin)])
async def upload_medicine_image(file: UploadFile = File(...)):
    url = await upload_image_to_s3(file, "medicines")
    return {"image_url": url}

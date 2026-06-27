from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from .models import OrderStatus, UserRole


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: str
    phone: str | None = None
    address: str | None = None


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    phone: str | None = None
    address: str | None = None


class UserOut(UserBase):
    id: int
    role: UserRole
    profile_picture_url: str | None = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class MedicineBase(BaseModel):
    name: str
    category: str
    description: str
    price: float = Field(gt=0)
    stock: int = Field(ge=0)
    manufacturer: str | None = None
    requires_prescription: bool = True
    image_url: str | None = None


class MedicineCreate(MedicineBase):
    pass


class MedicineUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    description: str | None = None
    price: float | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)
    manufacturer: str | None = None
    requires_prescription: bool | None = None
    image_url: str | None = None


class MedicineOut(MedicineBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class OrderItemCreate(BaseModel):
    medicine_id: int
    quantity: int = Field(ge=1, le=50)


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]
    shipping_address: str
    prescription_url: str


class OrderItemOut(BaseModel):
    id: int
    medicine_id: int
    quantity: int
    unit_price: float
    medicine: MedicineOut

    class Config:
        from_attributes = True


class PrescriptionOut(BaseModel):
    id: int
    image_url: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    user_id: int
    status: OrderStatus
    total_amount: float
    shipping_address: str
    rejection_reason: str | None = None
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemOut]
    prescription: PrescriptionOut | None = None
    user: UserOut | None = None

    class Config:
        from_attributes = True


class RejectOrderIn(BaseModel):
    reason: str = "Invalid/Wrong Prescription"


class StatusUpdate(BaseModel):
    status: OrderStatus


Token.model_rebuild()

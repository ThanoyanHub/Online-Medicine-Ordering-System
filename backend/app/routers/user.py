from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserOut, UserUpdate
from ..s3_service import upload_image_to_s3
from .auth import get_current_user


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_profile(payload: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/upload-profile-pic")
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    url = await upload_image_to_s3(file, "profile-pictures")
    current_user.profile_picture_url = url
    db.commit()
    return {"url": url}

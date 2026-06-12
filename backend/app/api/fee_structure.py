from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import FeeStructure
from pydantic import BaseModel
from app.api.auth import get_current_admin

router = APIRouter()

class FeeStructureCreate(BaseModel):
    class_name: str
    admission_fee: float = 0
    tuition_fee: float = 0
    exam_fee: float = 0
    transport_fee: float = 0
    library_fee: float = 0
    sports_fee: float = 0
    development_fee: float = 0
    academic_year: str = "2026-27"

class FeeStructureResponse(FeeStructureCreate):
    id: int
    total_fee: float
    
    class Config:
        from_attributes = True

@router.get("/structure", response_model=List[FeeStructureResponse])
def get_fee_structure(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Get all fee structures"""
    return db.query(FeeStructure).all()

@router.put("/structure/{class_name}")
def update_fee_structure(class_name: str, fee_data: FeeStructureCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Update fee structure for a class"""
    fee = db.query(FeeStructure).filter(FeeStructure.class_name == class_name).first()
    
    if not fee:
        # Create new if not exists
        fee = FeeStructure(class_name=class_name)
        db.add(fee)
    
    # Update fields
    for key, value in fee_data.dict().items():
        setattr(fee, key, value)
    
    # Calculate total
    fee.total_fee = fee.admission_fee + fee.tuition_fee + fee.exam_fee + fee.transport_fee + fee.library_fee + fee.sports_fee + fee.development_fee
    
    db.commit()
    db.refresh(fee)
    return fee

@router.post("/structure/bulk")
def bulk_update_fee_structure(fees: List[FeeStructureCreate], db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Bulk update fee structures"""
    updated = []
    for fee_data in fees:
        fee = db.query(FeeStructure).filter(FeeStructure.class_name == fee_data.class_name).first()
        if not fee:
            fee = FeeStructure(class_name=fee_data.class_name)
            db.add(fee)
        
        for key, value in fee_data.dict().items():
            setattr(fee, key, value)
        
        fee.total_fee = fee.admission_fee + fee.tuition_fee + fee.exam_fee + fee.transport_fee + fee.library_fee + fee.sports_fee + fee.development_fee
        updated.append(fee)
    
    db.commit()
    return {"message": f"Updated {len(updated)} fee structures", "data": updated}

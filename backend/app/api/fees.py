from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random
import string
from app.database import get_db
from app.models import FeePayment, Student
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class FeePaymentCreate(BaseModel):
    student_id: int
    amount: float
    payment_mode: str
    payment_for: str
    month: str
    year: int

class FeePaymentResponse(BaseModel):
    id: int
    student_id: int
    amount: float
    payment_mode: str
    receipt_number: str
    payment_date: date
    status: str
    
    class Config:
        from_attributes = True

def generate_receipt_number():
    prefix = "RC"
    random_digits = ''.join(random.choices(string.digits, k=8))
    return f"{prefix}{random_digits}"

@router.post("/", response_model=FeePaymentResponse)
def create_fee_payment(fee: FeePaymentCreate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == fee.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db_fee = FeePayment(
        receipt_number=generate_receipt_number(),
        **fee.dict()
    )
    db.add(db_fee)
    db.commit()
    db.refresh(db_fee)
    return db_fee

@router.get("/", response_model=List[FeePaymentResponse])
def get_fee_payments(db: Session = Depends(get_db)):
    return db.query(FeePayment).all()

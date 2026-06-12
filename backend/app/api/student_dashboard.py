from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
from app.database import get_db
from app.models import StudentNotice, StudentDocument, StudentCertificate, StudentMark, FeePaymentHistory, Marksheet, Student
from app.api.student_auth import get_current_student
from app.api.auth import get_current_admin
from pydantic import BaseModel

router = APIRouter()

# ==================== Response Models ====================

class NoticeResponse(BaseModel):
    id: int
    title: str
    content: str
    notice_type: str
    priority: str
    created_date: datetime
    
    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: int
    document_name: str
    document_type: str
    file_url: str
    upload_date: datetime
    
    class Config:
        from_attributes = True

class CertificateResponse(BaseModel):
    id: int
    certificate_name: str
    certificate_type: str
    issued_date: date
    certificate_number: str
    
    class Config:
        from_attributes = True

class MarkResponse(BaseModel):
    id: int
    exam_name: str
    subject: str
    marks_obtained: float
    total_marks: float
    percentage: float
    grade: str
    
    class Config:
        from_attributes = True

class PaymentHistoryResponse(BaseModel):
    id: int
    receipt_number: str
    amount: float
    payment_date: datetime
    payment_mode: str
    fee_type: str
    
    class Config:
        from_attributes = True

# ==================== Endpoints ====================

@router.get("/notices", response_model=List[NoticeResponse])
def get_student_notices(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    notices = db.query(StudentNotice).filter(
        StudentNotice.is_active == True,
        (StudentNotice.target_class == current_student.class_name) | (StudentNotice.target_class == "all")
    ).order_by(StudentNotice.created_date.desc()).limit(10).all()
    return notices

@router.get("/documents", response_model=List[DocumentResponse])
def get_student_documents(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return db.query(StudentDocument).filter(StudentDocument.student_id == current_student.id).all()

@router.get("/certificates", response_model=List[CertificateResponse])
def get_student_certificates(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return db.query(StudentCertificate).filter(StudentCertificate.student_id == current_student.id).all()

@router.get("/marks", response_model=List[MarkResponse])
def get_student_marks(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return db.query(StudentMark).filter(StudentMark.student_id == current_student.id).all()

@router.get("/payment-history", response_model=List[PaymentHistoryResponse])
def get_payment_history(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return db.query(FeePaymentHistory).filter(
        FeePaymentHistory.student_id == current_student.id
    ).order_by(FeePaymentHistory.payment_date.desc()).all()

@router.get("/dashboard-stats")
def get_dashboard_stats(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    notices_count = db.query(StudentNotice).filter(
        (StudentNotice.target_class == current_student.class_name) | (StudentNotice.target_class == "all"),
        StudentNotice.is_active == True
    ).count()
    
    documents_count = db.query(StudentDocument).filter(StudentDocument.student_id == current_student.id).count()
    certificates_count = db.query(StudentCertificate).filter(StudentCertificate.student_id == current_student.id).count()
    
    return {
        "notices_count": notices_count,
        "documents_count": documents_count,
        "certificates_count": certificates_count,
        "pending_fees": 0
    }

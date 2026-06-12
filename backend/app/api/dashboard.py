from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Student, FeePayment
from app.schemas import DashboardStats

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db)):
    total_students = db.query(Student).count()
    active_students = db.query(Student).filter(Student.status == "active").count()
    fees_collected = db.query(func.sum(FeePayment.amount)).scalar() or 0
    
    return DashboardStats(
        total_students=total_students,
        active_students=active_students,
        fees_collected=float(fees_collected),
        fees_pending=fees_collected * 0.2
    )

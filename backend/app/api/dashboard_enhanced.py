from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from app.database import get_db
from app.models import Student, FeePayment, Attendance
from app.api.auth import get_current_admin

router = APIRouter()

@router.get("/enhanced-stats")
def get_enhanced_stats(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Get enhanced dashboard statistics"""
    
    # Total students
    total_students = db.query(Student).count()
    active_students = db.query(Student).filter(Student.status == "active").count()
    
    # Monthly revenue (last 6 months)
    current_year = datetime.now().year
    monthly_revenue = []
    for month in range(1, 7):
        revenue = db.query(func.sum(FeePayment.amount)).filter(
            extract('year', FeePayment.payment_date) == current_year,
            extract('month', FeePayment.payment_date) == month
        ).scalar() or 0
        monthly_revenue.append(revenue)
    
    # Pending fees
    pending_fees = db.query(func.sum(Student.dues)).scalar() or 0
    
    # Attendance rate
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)
    attendance_records = db.query(Attendance).filter(Attendance.date >= week_ago).count()
    present_records = db.query(Attendance).filter(Attendance.date >= week_ago, Attendance.status == "present").count()
    attendance_rate = (present_records / attendance_records * 100) if attendance_records > 0 else 0
    
    # Class distribution
    class_distribution = db.query(Student.class_name, func.count(Student.id)).group_by(Student.class_name).all()
    
    return {
        "total_students": total_students,
        "active_students": active_students,
        "monthly_revenue": monthly_revenue,
        "pending_fees": pending_fees,
        "attendance_rate": round(attendance_rate, 2),
        "class_distribution": [{"class": c[0], "count": c[1]} for c in class_distribution]
    }

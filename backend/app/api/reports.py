from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import csv
import io
from app.database import get_db
from app.models import Student, FeePayment, Attendance
from app.api.auth import get_current_admin

router = APIRouter()

@router.get("/students")
def generate_student_report(format: str = "csv", class_name: Optional[str] = None, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Generate student report"""
    query = db.query(Student)
    if class_name:
        query = query.filter(Student.class_name == class_name)
    
    students = query.all()
    
    data = []
    for s in students:
        data.append({
            "Student ID": s.student_id,
            "Name": f"{s.first_name} {s.last_name}",
            "Class": s.class_name,
            "Section": s.section,
            "Parent Name": s.parent_name,
            "Phone": s.phone,
            "Email": s.email,
            "Status": s.status
        })
    
    if format == "csv":
        output = io.StringIO()
        if data:
            writer = csv.DictWriter(output, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
        
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=students_report_{datetime.now().strftime('%Y%m%d')}.csv"}
        )
    
    return {"data": data, "count": len(data)}

@router.get("/fees")
def generate_fee_report(format: str = "csv", db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Generate fee collection report"""
    payments = db.query(FeePayment).all()
    
    data = []
    for p in payments:
        student = db.query(Student).filter(Student.id == p.student_id).first()
        data.append({
            "Receipt No": p.receipt_number,
            "Student Name": f"{student.first_name} {student.last_name}" if student else "N/A",
            "Amount": p.amount,
            "Payment Date": p.payment_date.strftime("%Y-%m-%d"),
            "Payment Mode": p.payment_mode,
            "Payment For": p.payment_for
        })
    
    if format == "csv":
        output = io.StringIO()
        if data:
            writer = csv.DictWriter(output, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
        
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=fee_report_{datetime.now().strftime('%Y%m%d')}.csv"}
        )
    
    return {"data": data, "total_collected": sum(p.amount for p in payments)}

@router.get("/attendance")
def generate_attendance_report(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Generate attendance summary"""
    # Get attendance for current month
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    attendance_stats = db.query(
        Student.class_name,
        func.count(Attendance.id).label('total_days'),
        func.sum(case((Attendance.status == 'present', 1), else_=0)).label('present_days')
    ).join(Student).filter(
        extract('month', Attendance.date) == current_month,
        extract('year', Attendance.date) == current_year
    ).group_by(Student.class_name).all()
    
    return {
        "month": current_month,
        "year": current_year,
        "data": [
            {
                "class": stat[0],
                "total_days": stat[1],
                "present_days": stat[2],
                "attendance_percentage": round((stat[2] / stat[1] * 100), 2) if stat[1] > 0 else 0
            }
            for stat in attendance_stats
        ]
    }

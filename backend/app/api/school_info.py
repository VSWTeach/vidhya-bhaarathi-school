from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/school-info")
def get_school_info() -> Dict[str, Any]:
    return {
        "name": "Vidya Bharati Public School",
        "short_name": "VBPS",
        "tagline": "विद्या परम भूषणम् | Knowledge is the Ultimate Ornament",
        "established": 1995,
        "affiliation": "CBSE",
        "contact": {
            "phone": "+91 1234567890",
            "email": "info@vidyabharati.edu.in",
            "address": "123 Education Street, Civil Lines, New Delhi - 110001"
        },
        "stats": {
            "students": 2500,
            "teachers": 120,
            "classrooms": 65
        }
    }

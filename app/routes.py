"""
API routes for the application
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from typing import Optional
import os

from app.database import get_db
from app.models import Student
from app.utils import (
    validate_year_section,
    validate_last_digits,
    generate_register_number,
    validate_file_extension,
    validate_file_size,
    process_and_save_image,
    get_file_size,
    generate_csv_report,
    generate_excel_report_with_photos,
    get_weekly_registrations,
    get_year_wise_count,
    get_section_wise_count,
    get_registration_prefix,
    YEAR_SECTIONS
)

# Create router
router = APIRouter()

# Setup templates
templates = Jinja2Templates(directory="app/templates")


@router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """
    Render home page with registration form
    """
    return templates.TemplateResponse("index.html", {"request": request})


@router.get("/success", response_class=HTMLResponse)
async def success_page(request: Request, register_number: str = ""):
    """
    Render success page after registration
    """
    return templates.TemplateResponse("success.html", {
        "request": request,
        "register_number": register_number
    })


@router.get("/admin", response_class=HTMLResponse)
async def admin_dashboard(request: Request, db: Session = Depends(get_db), password: str = None):
    """
    Render admin dashboard with analytics (password protected)
    """
    # Simple password protection
    ADMIN_PASSWORD = "admin123"  # Change this to your desired password
    
    # Check if password is provided and correct
    if password != ADMIN_PASSWORD:
        # Return password prompt page
        return HTMLResponse(content="""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Login - AIML System</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
        </head>
        <body class="bg-light">
            <div class="container">
                <div class="row min-vh-100 align-items-center justify-content-center">
                    <div class="col-md-6 col-lg-4">
                        <div class="card shadow-lg border-0 rounded-4">
                            <div class="card-body p-5">
                                <div class="text-center mb-4">
                                    <i class="fas fa-shield-alt fa-3x text-primary mb-3"></i>
                                    <h3 class="mb-2">Admin Access</h3>
                                    <p class="text-muted">Enter password to continue</p>
                                </div>
                                <form method="GET" action="/admin">
                                    <div class="mb-4">
                                        <label for="password" class="form-label fw-semibold">Password</label>
                                        <input 
                                            type="password" 
                                            class="form-control form-control-lg rounded-pill" 
                                            id="password" 
                                            name="password"
                                            placeholder="Enter admin password"
                                            required
                                            autofocus
                                        >
                                    </div>
                                    <div class="d-grid gap-2">
                                        <button type="submit" class="btn btn-primary btn-lg rounded-pill">
                                            <i class="fas fa-sign-in-alt me-2"></i>Access Dashboard
                                        </button>
                                        <a href="/" class="btn btn-outline-secondary btn-lg rounded-pill">
                                            <i class="fas fa-arrow-left me-2"></i>Back to Registration
                                        </a>
                                    </div>
                                </form>
                                <div class="alert alert-info mt-4 mb-0" role="alert">
                                    <small><i class="fas fa-info-circle me-2"></i>Default password: admin123</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """)
    
    # Password is correct, show dashboard
    # Get all students
    students = db.query(Student).all()
    students_data = [student.to_dict() for student in students]
    
    # Calculate statistics
    total_students = len(students_data)
    year_wise = get_year_wise_count(students_data)
    section_wise = get_section_wise_count(students_data)
    weekly_students = get_weekly_registrations(students_data)
    weekly_count = len(weekly_students)
    
    return templates.TemplateResponse("admin.html", {
        "request": request,
        "total_students": total_students,
        "year_wise": year_wise,
        "section_wise": section_wise,
        "weekly_count": weekly_count
    })


@router.post("/api/register")
async def register_student(
    name: str = Form(...),
    year: int = Form(...),
    section: str = Form(...),
    last_digits: str = Form(...),
    photo: UploadFile = File(...),
    signature: UploadFile = File(...),
    has_ipad: str = Form(...),
    ipad_mac_address: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Register a new student with photo, signature, and iPad information
    """
    try:
        # Validate year and section
        if not validate_year_section(year, section):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid section '{section}' for Year {year}. Valid sections: {', '.join(YEAR_SECTIONS.get(year, []))}"
            )
        
        # Validate last digits
        if not validate_last_digits(last_digits):
            raise HTTPException(
                status_code=400,
                detail="Last digits must be exactly 3 numeric characters"
            )
        
        # Generate registration number
        register_number = generate_register_number(year, last_digits)
        if not register_number:
            raise HTTPException(
                status_code=400,
                detail="Invalid year selected"
            )
        
        # Check if registration number already exists
        existing_student = db.query(Student).filter(
            Student.register_number == register_number
        ).first()
        
        if existing_student:
            raise HTTPException(
                status_code=400,
                detail=f"Registration number {register_number} already exists. Please use different last 3 digits."
            )
        
        # Validate photo file
        if not validate_file_extension(photo.filename):
            raise HTTPException(
                status_code=400,
                detail="Invalid photo format. Only JPG and PNG files are allowed."
            )
        
        photo_size = get_file_size(photo.file)
        if not validate_file_size(photo_size):
            raise HTTPException(
                status_code=400,
                detail="Photo size exceeds 500KB limit. Please upload a smaller image."
            )
        
        # Validate signature file
        if not validate_file_extension(signature.filename):
            raise HTTPException(
                status_code=400,
                detail="Invalid signature format. Only JPG and PNG files are allowed."
            )
        
        signature_size = get_file_size(signature.file)
        if not validate_file_size(signature_size):
            raise HTTPException(
                status_code=400,
                detail="Signature size exceeds 500KB limit. Please upload a smaller image."
            )
        
        # Validate iPad MAC address if iPad is selected
        if has_ipad == 'Yes' and not ipad_mac_address:
            raise HTTPException(
                status_code=400,
                detail="iPad MAC address is required when iPad is selected"
            )
        
        # Process and save photo
        try:
            photo_path = process_and_save_image(photo.file, year, section, register_number)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing photo: {str(e)}"
            )
        
        # Process and save signature
        try:
            from app.utils import process_and_save_signature
            signature_path = process_and_save_signature(signature.file, year, section, register_number)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing signature: {str(e)}"
            )
        
        # Create new student record
        new_student = Student(
            name=name.strip(),
            year=year,
            section=section.upper(),
            register_number=register_number,
            photo_path=photo_path,
            signature_path=signature_path,
            has_ipad=has_ipad,
            ipad_mac_address=ipad_mac_address.upper() if ipad_mac_address else None
        )
        
        # Save to database
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Student registered successfully!",
                "register_number": register_number,
                "student": new_student.to_dict()
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )


@router.get("/api/check-register-number/{register_number}")
async def check_register_number(register_number: str, db: Session = Depends(get_db)):
    """
    Check if registration number already exists
    """
    existing = db.query(Student).filter(
        Student.register_number == register_number
    ).first()
    
    return {
        "exists": existing is not None,
        "register_number": register_number
    }


@router.get("/api/get-prefix/{year}")
async def get_prefix(year: int):
    """
    Get registration number prefix for a year
    """
    prefix = get_registration_prefix(year)
    if not prefix:
        raise HTTPException(status_code=400, detail="Invalid year")
    
    return {
        "year": year,
        "prefix": prefix,
        "sections": YEAR_SECTIONS.get(year, [])
    }


@router.get("/api/students")
async def get_all_students(db: Session = Depends(get_db)):
    """
    Get all registered students
    """
    students = db.query(Student).order_by(Student.created_at.desc()).all()
    return {
        "total": len(students),
        "students": [student.to_dict() for student in students]
    }


@router.get("/api/download-report")
async def download_report(db: Session = Depends(get_db)):
    """
    Download Excel report of all students with photos
    """
    # Get all students
    students = db.query(Student).order_by(Student.created_at.desc()).all()
    students_data = [student.to_dict() for student in students]
    
    if not students_data:
        raise HTTPException(
            status_code=404,
            detail="No student data available to generate report"
        )
    
    # Generate Excel report with photos
    try:
        filepath = generate_excel_report_with_photos(students_data)
        
        return FileResponse(
            path=filepath,
            filename=os.path.basename(filepath),
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating report: {str(e)}"
        )


@router.get("/api/download-weekly-report")
async def download_weekly_report(db: Session = Depends(get_db)):
    """
    Download Excel report of students registered in the last 7 days with photos
    """
    # Get all students
    students = db.query(Student).order_by(Student.created_at.desc()).all()
    students_data = [student.to_dict() for student in students]
    
    # Filter weekly registrations
    weekly_students = get_weekly_registrations(students_data)
    
    if not weekly_students:
        raise HTTPException(
            status_code=404,
            detail="No students registered in the last 7 days"
        )
    
    # Generate Excel report with photos
    try:
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"weekly_report_{timestamp}.xlsx"
        filepath = generate_excel_report_with_photos(weekly_students, filename)
        
        return FileResponse(
            path=filepath,
            filename=os.path.basename(filepath),
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating weekly report: {str(e)}"
        )


@router.get("/api/download-year-report/{year}")
async def download_year_report(year: int, db: Session = Depends(get_db)):
    """
    Download Excel report of students from a specific year with photos
    """
    # Validate year
    if year not in [1, 2, 3]:
        raise HTTPException(
            status_code=400,
            detail="Invalid year. Must be 1, 2, or 3"
        )
    
    # Get students from specific year
    students = db.query(Student).filter(Student.year == year).order_by(Student.created_at.desc()).all()
    students_data = [student.to_dict() for student in students]
    
    if not students_data:
        raise HTTPException(
            status_code=404,
            detail=f"No students found for Year {year}"
        )
    
    # Generate Excel report with photos
    try:
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"year_{year}_report_{timestamp}.xlsx"
        filepath = generate_excel_report_with_photos(students_data, filename)
        
        return FileResponse(
            path=filepath,
            filename=os.path.basename(filepath),
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating Year {year} report: {str(e)}"
        )


@router.get("/api/download-section-report/{year}/{section}")
async def download_section_report(year: int, section: str, db: Session = Depends(get_db)):
    """
    Download Excel report of students from a specific year and section with photos
    """
    # Validate year
    if year not in [1, 2, 3]:
        raise HTTPException(
            status_code=400,
            detail="Invalid year. Must be 1, 2, or 3"
        )
    
    # Validate section
    section = section.upper()
    if not validate_year_section(year, section):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid section '{section}' for Year {year}"
        )
    
    # Get students from specific year and section
    students = db.query(Student).filter(
        Student.year == year,
        Student.section == section
    ).order_by(Student.created_at.desc()).all()
    students_data = [student.to_dict() for student in students]
    
    if not students_data:
        raise HTTPException(
            status_code=404,
            detail=f"No students found for Year {year} Section {section}"
        )
    
    # Generate Excel report with photos
    try:
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"year_{year}_section_{section}_report_{timestamp}.xlsx"
        filepath = generate_excel_report_with_photos(students_data, filename)
        
        return FileResponse(
            path=filepath,
            filename=os.path.basename(filepath),
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating Year {year} Section {section} report: {str(e)}"
        )


@router.get("/api/stats")
async def get_statistics(db: Session = Depends(get_db)):
    """
    Get statistics for admin dashboard
    """
    students = db.query(Student).all()
    students_data = [student.to_dict() for student in students]
    
    return {
        "total_students": len(students_data),
        "year_wise": get_year_wise_count(students_data),
        "section_wise": get_section_wise_count(students_data),
        "weekly_count": len(get_weekly_registrations(students_data))
    }

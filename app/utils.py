"""
Utility functions for image processing, validation, and reporting
"""

import os
import re
from PIL import Image
from datetime import datetime, timedelta
import pandas as pd
from typing import Optional, Tuple


# Registration number prefixes based on year
YEAR_PREFIXES = {
    1: "RA2511026050",
    2: "RA2411026050",
    3: "RA2311026050"
}

# Valid sections per year
YEAR_SECTIONS = {
    1: ["A", "B", "C", "D", "E"],
    2: ["A", "B", "C", "D", "E"],
    3: ["A", "B", "C", "D"]
}

# Image settings
IMAGE_SIZE = (300, 300)
IMAGE_QUALITY = 70
MAX_FILE_SIZE = 500 * 1024  # 500KB in bytes
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png'}


def get_registration_prefix(year: int) -> Optional[str]:
    """
    Get registration number prefix for a given year
    """
    return YEAR_PREFIXES.get(year)


def validate_year_section(year: int, section: str) -> bool:
    """
    Validate if section is valid for the given year
    """
    valid_sections = YEAR_SECTIONS.get(year, [])
    return section.upper() in valid_sections


def validate_last_digits(last_digits: str) -> bool:
    """
    Validate that last digits are exactly 3 numeric characters
    """
    return bool(re.match(r'^\d{3}$', last_digits))


def generate_register_number(year: int, last_digits: str) -> Optional[str]:
    """
    Generate complete registration number
    """
    prefix = get_registration_prefix(year)
    if not prefix:
        return None
    return f"{prefix}{last_digits}"


def validate_file_extension(filename: str) -> bool:
    """
    Validate file extension
    """
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS


def validate_file_size(file_size: int) -> bool:
    """
    Validate file size (max 500KB)
    """
    return file_size <= MAX_FILE_SIZE


def create_upload_directory(year: int, section: str) -> str:
    """
    Create and return upload directory path
    """
    upload_dir = os.path.join("uploads", str(year), section.upper())
    os.makedirs(upload_dir, exist_ok=True)
    return upload_dir


def process_and_save_image(image_file, year: int, section: str, register_number: str) -> str:
    """
    Process image: resize, compress, and save
    Returns the saved file path
    """
    # Create directory
    upload_dir = create_upload_directory(year, section)
    
    # Generate filename
    filename = f"{register_number}.jpg"
    filepath = os.path.join(upload_dir, filename)
    
    # Open and process image
    img = Image.open(image_file)
    
    # Convert to RGB if necessary (for PNG with transparency)
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
    
    # Resize image to 300x300
    img = img.resize(IMAGE_SIZE, Image.Resampling.LANCZOS)
    
    # Save with compression
    img.save(filepath, 'JPEG', quality=IMAGE_QUALITY, optimize=True)
    
    return filepath


def get_file_size(file) -> int:
    """
    Get file size in bytes
    """
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)  # Reset to beginning
    return size


def generate_csv_report(students_data: list, filename: str = None) -> str:
    """
    Generate CSV report from student data
    """
    # Create reports directory if it doesn't exist
    reports_dir = "reports"
    os.makedirs(reports_dir, exist_ok=True)
    
    # Generate filename if not provided
    if not filename:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"student_report_{timestamp}.csv"
    
    filepath = os.path.join(reports_dir, filename)
    
    # Create DataFrame
    df = pd.DataFrame(students_data)
    
    # Reorder columns
    column_order = ['name', 'year', 'section', 'register_number', 'created_at']
    df = df[column_order]
    
    # Rename columns for better readability
    df.columns = ['Name', 'Year', 'Section', 'Register Number', 'Registration Date']
    
    # Save to CSV
    df.to_csv(filepath, index=False)
    
    return filepath


def get_weekly_registrations(students_data: list) -> list:
    """
    Filter students registered in the last 7 days
    """
    week_ago = datetime.now() - timedelta(days=7)
    
    weekly_students = []
    for student in students_data:
        created_at = student.get('created_at')
        if created_at:
            # Parse datetime string
            if isinstance(created_at, str):
                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            
            if created_at.replace(tzinfo=None) >= week_ago:
                weekly_students.append(student)
    
    return weekly_students


def get_year_wise_count(students_data: list) -> dict:
    """
    Get count of students per year
    """
    year_count = {1: 0, 2: 0, 3: 0}
    
    for student in students_data:
        year = student.get('year')
        if year in year_count:
            year_count[year] += 1
    
    return year_count


def get_section_wise_count(students_data: list) -> dict:
    """
    Get count of students per section
    """
    section_count = {}
    
    for student in students_data:
        section = student.get('section')
        if section:
            section_count[section] = section_count.get(section, 0) + 1
    
    return section_count


def format_file_size(size_bytes: int) -> str:
    """
    Format file size in human-readable format
    """
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"

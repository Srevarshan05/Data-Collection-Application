"""
SQLAlchemy database models
"""

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Student(Base):
    """
    Student model for storing registration data
    """
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    year = Column(Integer, nullable=False)
    section = Column(String(1), nullable=False)
    register_number = Column(String(50), unique=True, nullable=False, index=True)
    photo_path = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Student {self.register_number} - {self.name}>"

    def to_dict(self):
        """
        Convert model to dictionary
        """
        return {
            "id": self.id,
            "name": self.name,
            "year": self.year,
            "section": self.section,
            "register_number": self.register_number,
            "photo_path": self.photo_path,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

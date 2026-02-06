"""
Script to reset the database - drops all tables and recreates them
WARNING: This will delete all existing data!
"""

from app.database import Base, engine
from app.models import Student

def reset_database():
    """
    Drop all tables and recreate them
    """
    print("⚠️  WARNING: This will delete all existing data!")
    confirm = input("Type 'YES' to confirm: ")
    
    if confirm == "YES":
        print("🗑️  Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("✅ Tables dropped successfully!")
        
        print("📊 Creating new tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
        print("🎉 Database reset complete!")
    else:
        print("❌ Operation cancelled")

if __name__ == "__main__":
    reset_database()

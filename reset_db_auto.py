"""
Automatic database reset script - no confirmation needed
WARNING: This will delete all existing data!
"""

from app.database import Base, engine
from app.models import Student

def reset_database():
    """
    Drop all tables and recreate them
    """
    print("🗑️  Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("✅ Tables dropped successfully!")
    
    print("📊 Creating new tables with updated schema...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")
    print("🎉 Database reset complete!")
    print("\n📋 New schema includes:")
    print("   - name")
    print("   - year")
    print("   - section")
    print("   - register_number")
    print("   - photo_path")
    print("   - has_ipad (NEW)")
    print("   - ipad_mac_address (NEW)")
    print("   - signature_path (NEW)")
    print("   - created_at")

if __name__ == "__main__":
    reset_database()

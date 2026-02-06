"""
Database initialization script
Run this script to create the database and tables
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_database():
    """
    Create PostgreSQL database if it doesn't exist
    """
    # Parse DATABASE_URL
    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/college_registration")
    
    # Extract connection details
    # Format: postgresql://user:password@host:port/database
    parts = db_url.replace("postgresql://", "").split("@")
    user_pass = parts[0].split(":")
    host_port_db = parts[1].split("/")
    host_port = host_port_db[0].split(":")
    
    user = user_pass[0]
    password = user_pass[1] if len(user_pass) > 1 else ""
    host = host_port[0]
    port = host_port[1] if len(host_port) > 1 else "5432"
    database = host_port_db[1]
    
    print("=" * 60)
    print("College Data Collection Application - Database Setup")
    print("=" * 60)
    print(f"\n📊 Database Configuration:")
    print(f"   Host: {host}")
    print(f"   Port: {port}")
    print(f"   User: {user}")
    print(f"   Database: {database}")
    print()
    
    try:
        # Connect to PostgreSQL server (default postgres database)
        print("🔌 Connecting to PostgreSQL server...")
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database="postgres"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{database}'")
        exists = cursor.fetchone()
        
        if exists:
            print(f"✅ Database '{database}' already exists")
        else:
            # Create database
            print(f"📝 Creating database '{database}'...")
            cursor.execute(f"CREATE DATABASE {database}")
            print(f"✅ Database '{database}' created successfully!")
        
        cursor.close()
        conn.close()
        
        print("\n" + "=" * 60)
        print("✅ Database setup completed successfully!")
        print("=" * 60)
        print("\n📌 Next Steps:")
        print("   1. Install dependencies: pip install -r requirements.txt")
        print("   2. Run the application: uvicorn app.main:app --host 0.0.0.0 --port 8000")
        print("   3. Access at: http://localhost:8000")
        print("\n" + "=" * 60)
        
        return True
        
    except psycopg2.OperationalError as e:
        print(f"\n❌ Error connecting to PostgreSQL:")
        print(f"   {str(e)}")
        print("\n💡 Troubleshooting:")
        print("   1. Make sure PostgreSQL is installed and running")
        print("   2. Check your database credentials in .env file")
        print("   3. Verify PostgreSQL service is active:")
        print("      - Windows: Check Services (services.msc)")
        print("      - Linux/Mac: sudo systemctl status postgresql")
        print()
        return False
        
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        return False


if __name__ == "__main__":
    create_database()

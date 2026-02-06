"""
FastAPI main application
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database import init_db
from app.routes import router

# Create FastAPI app
app = FastAPI(
    title="College Data Collection Application",
    description="Student registration system with image upload and reporting",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("reports", exist_ok=True)
os.makedirs("app/static/css", exist_ok=True)
os.makedirs("app/static/js", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routes
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    """
    Initialize database on startup
    """
    print("🚀 Starting College Data Collection Application...")
    print("📊 Initializing database...")
    try:
        init_db()
        print("✅ Application started successfully!")
        print("🌐 Access the application at: http://localhost:8000")
        print("👨‍💼 Admin dashboard at: http://localhost:8000/admin")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        print("⚠️  Please check your database configuration in .env file")


@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "application": "College Data Collection Application",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

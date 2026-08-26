from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.hazard_router import router as hazard_router
from api.dispatch_router import router as dispatch_router

app = FastAPI(
    title="RAKSHA-AI Baseline Backend API Engine",
    description="Self-Contained Landslide Hazard Risk & Rescue Optimization System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Standard CORS Middleware Setup for React Frontend SPA Communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production setup allows configuration via environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(hazard_router)
app.include_router(dispatch_router)

@app.get("/", tags=["System Status"])
async def root():
    return {
        "system": "RAKSHA-AI Product Baseline API",
        "status": "ONLINE",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/health", tags=["System Status"])
async def health():
    return {"status": "HEALTHY", "engine": "FastAPI", "optimization_solver": "SciPy HiGHS LP"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

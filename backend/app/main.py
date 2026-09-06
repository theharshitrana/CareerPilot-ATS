from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.resume import router as resume_router
from app.routes.job import router as job_router
from app.routes.interview import router as interview_router
from app.routes.ats import router as ats_router


app = FastAPI(
    title="CareerPilot AI",
    description="AI Resume & Interview Assistant",
    version="1.0.0",
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==========================================
# ROUTES
# ==========================================

app.include_router(
    health_router,
    prefix="/api",
    tags=["Health"],
)

app.include_router(
    resume_router,
    prefix="/api/resume",
    tags=["Resume"],
)

app.include_router(
    job_router,
    prefix="/api/job",
    tags=["Job Matching"],
)

app.include_router(
    interview_router,
    prefix="/api/interview",
    tags=["Interview"],
)

app.include_router(
    ats_router,
    prefix="/api/ats",
    tags=["ATS"]
)


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():

    return {
        "application": "CareerPilot AI",
        "description": "AI Resume & Interview Assistant",
        "version": "1.0.0",
        "status": "running",
    }

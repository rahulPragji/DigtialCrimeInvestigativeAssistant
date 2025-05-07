from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import health, crimesubtypes, evidence, embeddings, ask  # Import all routers

# Initialize FastAPI
app = FastAPI(
    title="Digital Crime Investigation Assistant API",
    description="API for processing queries about digital forensics",
    version="1.0.0"
)
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(crimesubtypes.router)
app.include_router(evidence.router)
app.include_router(embeddings.router)
app.include_router(ask.router)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Digital Crime Investigative Assistant API"}


if __name__ == "__main__":
    # Run the application with Uvicorn if called directly
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 
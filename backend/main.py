from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any
import uvicorn

from database import get_db, init_db, QuizRecord
from scraper import scrape_wikipedia
from ai_logic import generate_quiz

app = FastAPI(title="Wiki Quiz App", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class GenerateRequest(BaseModel):
    url: HttpUrl


class GenerateResponse(BaseModel):
    id: int
    url: str
    title: str
    data: Dict[str, Any]
    created_at: str


class HistoryResponse(BaseModel):
    id: int
    url: str
    title: str
    data: Dict[str, Any]
    created_at: str


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()


@app.post("/generate", response_model=GenerateResponse)
async def generate_quiz_endpoint(request: GenerateRequest, db: Session = Depends(get_db)):
    """
    Generate a quiz from a Wikipedia URL.
    
    1. Scrapes the Wikipedia page
    2. Calls AI to generate quiz data
    3. Saves to database
    4. Returns the quiz record
    """
    url_str = str(request.url)
    
    try:
        # Step 1: Scrape Wikipedia
        scraped_data = scrape_wikipedia(url_str)
        
        # Step 2: Generate quiz using AI
        quiz_data = generate_quiz(scraped_data["full_text"])
        
        # Step 3: Save to database
        quiz_record = QuizRecord(
            url=url_str,
            title=scraped_data["title"],
            data={
                "summary": quiz_data.get("summary", ""),
                "key_entities": quiz_data.get("key_entities", []),
                "quiz_questions": quiz_data.get("quiz_questions", []),
                "related_topics": quiz_data.get("related_topics", [])
            }
        )
        
        db.add(quiz_record)
        db.commit()
        db.refresh(quiz_record)
        
        # Step 4: Return the record
        return GenerateResponse(
            id=quiz_record.id,
            url=quiz_record.url,
            title=quiz_record.title,
            data=quiz_record.data,
            created_at=quiz_record.created_at.isoformat()
        )
    
    except Exception as e:
        print(f"Error details: {e}") # This shows in your terminal
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history", response_model=List[HistoryResponse])
async def get_history(db: Session = Depends(get_db)):
    """
    Get all quiz records from the database.
    
    Returns a list of all quiz records ordered by creation date (newest first).
    """
    try:
        records = db.query(QuizRecord).order_by(QuizRecord.created_at.desc()).all()
        
        return [
            HistoryResponse(
                id=record.id,
                url=record.url,
                title=record.title,
                data=record.data,
                created_at=record.created_at.isoformat()
            )
            for record in records
        ]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/")
@app.head("/")
async def root():
    """Root endpoint"""
    return {"message": "Wiki Quiz App API", "version": "1.0.0"}


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
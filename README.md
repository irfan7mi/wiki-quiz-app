🚀 Tech Stack

Backend: FastAPI (Python 3.10+), SQLAlchemy (PostgreSQL ORM), BeautifulSoup4.

AI/LLM: LangChain, Google Gemini (gemini-3-flash-preview), Pydantic (Structured Output).

Frontend: React (Vite), Tailwind CSS, Axios.

Database: PostgreSQL.

🛠️ Setup Instructions

1. Backend Setup

Bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables (.env)
# Create a .env file with the following:
# DATABASE_URL=postgresql://user:pass@localhost:5432/wikiquiz
# GOOGLE_API_KEY=your_gemini_api_key

# Run the server
python main.py
2. Frontend Setup

Bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
📡 API Endpoints

Method	Endpoint	Description
POST	/generate	Scrapes Wiki URL, generates quiz, and saves to DB.
GET	/history	Returns a list of all past generated quizzes.
GET	/health	Check if API is running.
🤖 LangChain Prompt Template
Used in ai_logic.py to ensure structured, high-quality generation.

Python
template = """
You are an expert quiz creator. Analyze the provided Wikipedia content and generate a quiz.
- Generate a 2-paragraph summary.
- Identify key entities (people, orgs, locations).
- Create 5-10 questions with 4 options each.
- Assign a difficulty (easy, medium, hard) to each question.
- Suggest 3-5 related Wikipedia topics for further reading.

{format_instructions}

Content: {content}
"""
📄 backend/requirements.txt
Plaintext
fastapi==0.109.0
uvicorn==0.27.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
beautifulsoup4==4.12.3
requests==2.31.0
langchain-google-genai==0.0.6
langchain-core==0.1.15
python-dotenv==1.0.1
pydantic==2.6.0
📁 sample_data/alan_turing.json
JSON
{
  "id": 1,
  "url": "https://en.wikipedia.org/wiki/Alan_Turing",
  "title": "Alan Turing",
  "data": {
    "summary": "Alan Turing was a pioneering English mathematician and computer scientist...",
    "key_entities": [
      { "name": "Bletchley Park", "type": "organization", "description": "UK's codebreaking center" }
    ],
    "quiz_questions": [
      {
        "question": "What was the name of the machine Turing designed to crack Enigma?",
        "options": [
          { "text": "The Bombe", "is_correct": true },
          { "text": "Colossus", "is_correct": false },
          { "text": "Enigma", "is_correct": false },
          { "text": "ACE", "is_correct": false }
        ],
        "explanation": "The Bombe was an electromechanical device used to decipher Enigma messages.",
        "difficulty": "medium"
      }
    ],
    "related_topics": ["Enigma machine", "Turing test", "Theoretical computer science"]
  },
  "created_at": "2026-01-11T12:00:00Z"
}
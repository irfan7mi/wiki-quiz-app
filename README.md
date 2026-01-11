# 🎓 AI Wikipedia Quiz Generator

A full-stack application that uses Google Gemini 3 Flash to transform Wikipedia articles into interactive study materials.

## 🛠 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios
- **Backend:** FastAPI (Python 3.13), SQLAlchemy 2.0
- **AI:** LangChain, Google Gemini 3 Flash (`gemini-3-flash-preview`)
- **Database:** PostgreSQL (Hosted on Render)
- **Deployment:** Vercel (Frontend), Render (Backend)

## ✨ Recent Updates & Features
- **Modern Lifespan Events:** Updated `main.py` to use `asynccontextmanager` for database startup (replacing deprecated `on_event`).
- **Enhanced Schema:** Added `difficulty` levels (Easy, Medium, Hard) to questions and `related_topics` for further reading.
- **Python 3.13 Compatibility:** Upgraded SQLAlchemy and dependencies to resolve internal metadata errors.
- **Secure Deployment:** Configured Vite environment variables (`VITE_API_URL`) for seamless Vercel-to-Render communication.

## 🤖 LangChain Prompt Template
The application uses the following structured logic to guide the AI:
> "You are an expert quiz creator. Analyze the provided Wikipedia content and generate a structured quiz including a 2-paragraph summary, key entities (names/orgs), 5-10 multiple-choice questions with difficulty levels, and 3-5 related Wikipedia topic titles."



## 🚀 Local Setup Instructions

### Backend
1. Navigate to `/backend`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Create `.env` with `DATABASE_URL` and `GOOGLE_API_KEY`.
4. Run: `python -m uvicorn main:app --reload --port 8001`.

### Frontend
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Create `.env.local` with `VITE_API_URL=http://localhost:8001`.
4. Run: `npm run dev`.

## 📡 API Endpoints
- `GET /`: Health check and lifespan verification.
- `POST /generate`: Scrapes Wikipedia and returns a structured AI quiz.
- `GET /history`: Fetches all previous quiz results from the database.

## 📸 Screenshots
Screenshots are stored in: `/Users/irfan/Documents/wiki-quiz-app/wiki/screenshots`
- `Tab-1.png`
- `Tab-2.png`
- `BonusTab.png`
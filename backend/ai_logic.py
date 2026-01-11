import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List, Dict

load_dotenv()

# Schema for Structured Output
class QuizOption(BaseModel):
    text: str = Field(description="Option text")
    is_correct: bool = Field(description="True if correct")

class QuizQuestion(BaseModel):
    question: str = Field(description="The question text")
    options: List[QuizOption] = Field(description="4 options")
    explanation: str = Field(description="Why the answer is correct")
    difficulty: str = Field(description="The level of the question: easy, medium, or hard")

class QuizData(BaseModel):
    summary: str = Field(description="Summary of article")
    key_entities: List[Dict[str, str]] = Field(description="Main entities")
    quiz_questions: List[QuizQuestion] = Field(description="5-10 questions")
    related_topics: List[str] = Field(description="3-5 related Wikipedia topic titles")

def generate_quiz(scraped_text: str) -> Dict:
    # 1. Initialize with correct parameters for latest LangChain versions
    llm = ChatGoogleGenerativeAI(
        model="gemini-3-flash-preview",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.1,
        # INSTEAD OF client_options, use the dedicated version param if supported
        # OR simply rely on the model name which now auto-routes correctly
    )

    # 2. Bind the structured output
    structured_llm = llm.with_structured_output(QuizData)

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert quiz creator. Analyze the content and generate a structured quiz."),
        ("human", "{content}")
    ])

    chain = prompt | structured_llm
    
    try:
        # Use a slice to avoid payload size errors
        response = chain.invoke({"content": scraped_text[:15000]})
        return response.model_dump()
    except Exception as e:
        # If the specific Flash model still 404s, try 'gemini-pro'
        print(f"Generation error: {e}")
        raise e
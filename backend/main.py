import uvicorn
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import fitz
from transformers import pipeline
from pydantic import BaseModel
from google import genai
import spacy
nlp = spacy.load("en_core_web_sm")


client = genai.Client(api_key = "AIzaSyByAq7OTtdMQrZDEm2cxyOU-ao_Uo8_Co0")



# main.py (simplified example)
def load_words(filepath="words.txt"):
    """Load all words from a file into a Python set."""
    with open(filepath, "r", encoding="utf-8") as f:
        return set(word.strip().lower() for word in f if word.strip())

def remove_common_words_from_resume(resume_text, common_words):
    # Load list of filler/common words
    words = resume_text.split()
    filtered_words = [w for w in words if w.lower() not in common_words]

    # Recombine into cleaned text
    cleaned_resume = " ".join(filtered_words)

    return cleaned_resume

def extract_and_compare_keywords(resume, job):
    doc1 = nlp(resume)
    doc2 = nlp(job)
    resume_keywords = {
        token.text.lower()
        for token in doc1
        if token.pos_ in {"NOUN", "PROPN"} and len(token.text) > 2
    }

    job_keywords = {
        token.text.lower()
        for token in doc2
        if token.pos_ in {"NOUN", "PROPN"} and len(token.text) > 2
    }

    matched = resume_keywords.intersection(job_keywords)
    missing = job_keywords - resume_keywords

    score = round(len(matched) / len(job_keywords) * 100, 2)
    print(score)

class ResultResponse(BaseModel):
    text: str

app = FastAPI()

temp_storage ={ 'text': '', 'matched_score' : ''}

origins = [
    "http://localhost:3000",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...), job_posting: str = Form(...)):

    text = ""

    contents = await file.read()  # read file into memory
    text = ""
    doc = fitz.open(stream=contents, filetype="pdf")
    for page in doc:
        text = page.get_text()

    clean_text = (
        text.replace("\n", " ")        # remove newlines
            .replace("  ", " ")        # collapse double spaces
            .strip()
    )

    clean_job_posting = (
        job_posting.replace("\n", " ")        # remove newlines
            .replace("  ", " ")        # collapse double spaces
            .strip()
    )
    

    words_set = load_words("words.txt")

    removed_common_words = remove_common_words_from_resume(clean_text, words_set)

    removed_common_words_job_posting = remove_common_words_from_resume(clean_job_posting, words_set)

    match_score = extract_and_compare_keywords(removed_common_words, removed_common_words_job_posting)

    prompt = f"Analyze the following resume and give 5 actionable suggestions to make it more ATS-friendly. Use bullet points.\n\n{contents}"

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    )

    print(response.text)

    generated_text = response.text

    temp_storage['text'] = generated_text
    temp_storage['matched_score'] = match_score

    return {"filename": file.filename, "message": "Upload successful", "text": generated_text}


@app.get("/results/", response_model=ResultResponse)
async def result_text():
    return temp_storage

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import fitz
from pydantic import BaseModel
from google import genai
import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity



client = genai.Client(api_key = "AIzaSyByAq7OTtdMQrZDEm2cxyOU-ao_Uo8_Co0")

def clean_and_split_feedback(generated_text: str):
    # Remove markdown bolds, bullets, and excessive whitespace
    text = re.sub(r"\*\*|#+", "", generated_text).strip()

    # Normalize all bullets (convert "•", "-", etc. to "1." style)
    text = re.sub(r"[\n\r]+[\-\*\•]\s*", "\n1. ", text)

    # Ensure consistent numbering (Gemini sometimes omits numbers)
    numbered_text = []
    counter = 1
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        # Detect existing numbering
        if re.match(r"^\d+\.", line):
            numbered_text.append(line)
        else:
            numbered_text.append(f"{counter}. {line}")
            counter += 1

    # Now extract each numbered suggestion cleanly
    suggestions = re.split(r"\d+\.\s*", "\n".join(numbered_text))
    suggestions = [s.strip() for s in suggestions if len(s.strip()) > 0]

    # Optional: remove intro line if it's not an actionable suggestion
    if suggestions and "suggestion" in suggestions[0].lower():
        suggestions.pop(0)

    return suggestions

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

def extract_and_compare_semantic_gemini(resume_text, job_text):
    resume_emb = [
        np.array(e.values) for e in client.models.embed_content(
        model="gemini-embedding-001", 
        contents=resume_text
    ).embeddings
    ]

    job_emb = [
        np.array(e.values) for e in client.models.embed_content(
        model="gemini-embedding-001",
        contents=job_text
    ).embeddings
    ]

    results = resume_emb + job_emb
    
    embeddings_matrix = np.array(results)
    score = cosine_similarity(embeddings_matrix)

    return score[0][1]

class ResultResponse(BaseModel):
    text: List[str]
    matched_score: float | None = None

app = FastAPI()

temp_storage ={ 'text': [], 'matched_score' : ''}

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

    match_score = extract_and_compare_semantic_gemini(removed_common_words, removed_common_words_job_posting)

    prompt = f"Analyze the following resume and give 5 actionable suggestions to make it more ATS-friendly but don't make each point too long. Use bullet points.\n\n{clean_text}. However, if there is a job posting, give more direct feedback on how the resume could improve relative to the job posting. \n\n {clean_job_posting}"
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    )

    generated_text = response.text

    suggestions = clean_and_split_feedback(generated_text)

    temp_storage['text'] = suggestions

    temp_storage['text'] = suggestions
    temp_storage['matched_score'] = match_score

    return {"filename": file.filename, "message": "Upload successful", "text": suggestions, "matched_score": match_score}


@app.get("/results/", response_model=ResultResponse)
async def result_text():
    return temp_storage

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
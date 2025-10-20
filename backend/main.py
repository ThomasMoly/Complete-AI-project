import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import fitz
from transformers import pipeline
from pydantic import BaseModel

class ResultResponse(BaseModel):
    text: str

app = FastAPI()

temp_storage ={ 'text': ''}

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
async def upload_pdf(file: UploadFile = File(...)):
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
    
    prompt = f"Analyze the following resume and give 5 actionable suggestions to make it more ATS-friendly. Use bullet points.\n\n{clean_text}"

    generator = pipeline("text-generation", model="gpt2")

    output = generator(prompt)

    generated_text = output[0]["generated_text"]

    temp_storage['text'] = generated_text

    return {"filename": file.filename, "message": "Upload successful", "text": output}


@app.get("/results/", response_model=ResultResponse)
async def result_text():
    return temp_storage

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
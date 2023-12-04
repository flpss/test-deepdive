import sys
sys.path.insert(0, './app')
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from pydub import AudioSegment
from io import BytesIO
from uuid import uuid4
import process
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

BASE_URL = "http://localhost:8000/"

app = FastAPI(title="Deepdive Test")

origins = ["*", 'http://localhost:4200']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/files", StaticFiles(directory="files"), name="files")

@app.get("/")
def read_root():
    return "Healthy"

# Converts MP3 to WAV
def mp3_to_wav(mp3_bytes):
    audio = AudioSegment.from_mp3(BytesIO(mp3_bytes))
    wav_bytes = audio.export(format="wav").read()
    return wav_bytes

@app.post("/upload/")
async def upload_file(
    file: UploadFile = File(...),
    languageIn: str = Form(..., title="Language", description="Language of the input file"),
    languageOut: str = Form(..., title="Language", description="Language of the output file"),
    tld: str = Form(None, title="TLD", description="Top-level domain of the output file")
):
    if tld == "null":
        tld = None
    # Generate a random file name
    file_name = f"files/{uuid4()}.wav"

    # Check if the file is an MP3
    if file.filename.endswith(".mp3"):
        # Convert MP3 to WAV
        wav_content = mp3_to_wav(await file.read())
        # Save the WAV file
        with open(file_name, "wb") as wav_file:
            wav_file.write(wav_content)

    # If the file is already a WAV, save it directly
    elif file.filename.endswith(".wav"):
        with open(file_name, "wb") as wav_file:
            wav_file.write(await file.read())

    # If the file is neither MP3 nor WAV, return an error
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload an MP3 or WAV file.")

    # Convert WAV to text
    text = process.convert_wav_to_text(file_name, languageIn)
    translate_language = languageOut[:2] if languageOut[:2] != "zh" else languageOut
    translated_text = process.translate_text(text, translate_language)
    audio_file = process.text_to_audio(translated_text, languageOut, tld=tld)
    return {"audio_file": BASE_URL + audio_file}
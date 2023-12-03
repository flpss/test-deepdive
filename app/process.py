from fastapi import HTTPException
import speech_recognition as sr
from googletrans import Translator
from gtts import gTTS
from uuid import uuid4

def convert_wav_to_text(file, language):
    # Initialize recognizer class (for recognizing the speech)
    recognizer = sr.Recognizer()

    with sr.AudioFile(file) as source:
        # Read the audio data from the file
        audio_data = recognizer.record(source)

        try:
            # Convert speech to text
            text = recognizer.recognize_google(audio_data, language=language)
            return text

        except sr.UnknownValueError:
            raise HTTPException(status_code=400, detail="Google Speech Recognition could not understand audio")

        except sr.RequestError as e:
            raise HTTPException(status_code=500, detail="Could not request results from Google Speech Recognition service; {e}")


# Translate text from a language to another
def translate_text(text, target_language):
    translator = Translator()

    try:
        translation = translator.translate(text, dest=target_language)
        translated_text = translation.text
        return translated_text
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Translation error: {e}")

def text_to_audio(text, language, tld=None):
    try:
        output_file = f"files/{uuid4()}.mp3"
        # Create a gTTS object
        if tld is None:
            tts = gTTS(text=text, lang=language)
        else:
            tts = gTTS(text=text, lang=language, tld=tld)

        # Save the generated audio file
        tts.save(output_file)

        return output_file

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error converting text to audio: {e}")
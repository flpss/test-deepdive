from fastapi import HTTPException
import speech_recognition as sr
from googletrans import Translator

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
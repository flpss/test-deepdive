# app/main.py

from fastapi import FastAPI

app = FastAPI(title="Deepdive Test")


@app.get("/")
def read_root():
    return "Healthy"
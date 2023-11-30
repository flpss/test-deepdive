# Dockerfile
FROM python:3.11-slim

RUN apt-get -y update
RUN apt-get install -y ffmpeg

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
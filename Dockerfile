FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PYTHONPATH=/app/backend:/app/ai

WORKDIR /app

COPY backend/requirements.txt /tmp/backend-requirements.txt
COPY ai/requirements.txt /tmp/ai-requirements.txt

RUN pip install --upgrade pip \
    && pip install -r /tmp/backend-requirements.txt -r /tmp/ai-requirements.txt

COPY backend /app/backend
COPY ai /app/ai

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:create_app --factory --host 0.0.0.0 --port ${PORT:-8000}"]

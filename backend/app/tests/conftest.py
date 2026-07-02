import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[3]
BACKEND_PATH = ROOT / "backend"
AI_PATH = ROOT / "ai"

for path in (str(BACKEND_PATH), str(AI_PATH)):
    if path not in sys.path:
        sys.path.insert(0, path)


@pytest.fixture
def client(tmp_path, monkeypatch):
    database_path = tmp_path / "test_phase0.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{database_path}")
    monkeypatch.setenv("ENABLE_AI_MOCK_MODE", "true")
    monkeypatch.setenv("AI_PROVIDER", "mock")
    monkeypatch.setenv("TESTING", "true")

    from app.core.config import get_settings
    from app.db.session import reset_engine
    from app.main import create_app
    from gff_ai.config import get_ai_settings

    get_settings.cache_clear()
    get_ai_settings.cache_clear()
    reset_engine()

    app = create_app()
    with TestClient(app) as test_client:
        yield test_client

    reset_engine()
    get_settings.cache_clear()
    get_ai_settings.cache_clear()

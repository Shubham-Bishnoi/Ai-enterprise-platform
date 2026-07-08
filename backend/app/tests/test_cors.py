from fastapi import FastAPI

from app.core.config import Settings
from app.core.cors import add_cors_middleware


def test_parse_comma_separated_cors_origins():
    settings = Settings(
        backend_cors_origins="http://localhost:5173, https://your-vercel-domain.vercel.app",
    )

    assert settings.backend_cors_origins == [
        "http://localhost:5173",
        "https://your-vercel-domain.vercel.app",
    ]


def test_disallow_wildcard_cors_in_production():
    app = FastAPI()
    settings = Settings(
        backend_cors_origins=["*", "https://your-vercel-domain.vercel.app"],
        environment="production",
        debug=False,
    )

    add_cors_middleware(app, settings)

    assert app.user_middleware[0].kwargs["allow_origins"] == [
        "https://your-vercel-domain.vercel.app"
    ]


def test_allow_wildcard_cors_in_debug_mode():
    app = FastAPI()
    settings = Settings(
        backend_cors_origins=["*"],
        environment="development",
        debug=True,
    )

    add_cors_middleware(app, settings)

    assert app.user_middleware[0].kwargs["allow_origins"] == ["*"]

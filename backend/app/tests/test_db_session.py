from app.db.session import _engine_kwargs


def test_sqlite_engine_kwargs():
    assert _engine_kwargs("sqlite:///tmp.db") == {
        "connect_args": {"check_same_thread": False}
    }


def test_supabase_pooler_disables_prepared_statements():
    kwargs = _engine_kwargs(
        "postgresql+psycopg://user:password@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"
    )

    assert kwargs["pool_pre_ping"] is True
    assert kwargs["connect_args"] == {"prepare_threshold": None}


def test_standard_postgres_engine_kwargs():
    assert _engine_kwargs("postgresql+psycopg://user:password@db.example.com:5432/postgres") == {
        "pool_pre_ping": True
    }

class InMemoryCheckpointer:
    def __init__(self) -> None:
        self._states: dict[str, dict] = {}

    def put(self, session_id: str, state: dict) -> None:
        self._states[session_id] = state

    def get(self, session_id: str) -> dict | None:
        return self._states.get(session_id)

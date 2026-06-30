class SessionMemoryStore:
    def summarize(self, messages: list[dict]) -> dict:
        return {
            "message_count": len(messages),
            "last_message": messages[-1]["content"] if messages else None,
        }

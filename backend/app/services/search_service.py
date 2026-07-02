from __future__ import annotations

import re
from collections import Counter

from sqlalchemy.orm import Session

from app.repositories.search import SearchRepository
from app.schemas.search import SearchResponse, SearchResultOut, SearchSuggestionResponse


class SearchService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = SearchRepository(db)

    def search(self, query: str) -> SearchResponse:
        q = (query or "").strip()
        if not q:
            featured = self.repository.list_featured()
            results = [
                SearchResultOut(
                    title=e.title,
                    category=e.category,
                    description=e.description,
                    link=e.link,
                    tags=list(e.tags or []),
                    source_type=e.source_type,
                    relevance_score=float(1.0 + (e.relevance_base or 0) / 100.0),
                )
                for e in featured
            ]
            return SearchResponse(results=results, query=q, total=len(results))

        tokens = self._tokenize(q)
        entries = self.repository.list_all()
        scored: list[tuple[float, SearchResultOut]] = []
        for entry in entries:
            score = self._score_entry(entry, tokens)
            if score <= 0:
                continue
            scored.append(
                (
                    score,
                    SearchResultOut(
                        title=entry.title,
                        category=entry.category,
                        description=entry.description,
                        link=entry.link,
                        tags=list(entry.tags or []),
                        source_type=entry.source_type,
                        relevance_score=score,
                    ),
                )
            )

        scored.sort(key=lambda item: item[0], reverse=True)
        results = [item[1] for item in scored[:30]]
        return SearchResponse(results=results, query=q, total=len(results))

    def suggestions(self, query: str) -> SearchSuggestionResponse:
        q = (query or "").strip().lower()
        tags = self._top_tags(limit=60)
        if not q:
            return SearchSuggestionResponse(suggestions=tags[:12], query="")
        suggestions = [tag for tag in tags if q in tag.lower()]
        return SearchSuggestionResponse(suggestions=suggestions[:12], query=query)

    def chips(self) -> list[str]:
        return self._top_tags(limit=12)

    def _top_tags(self, limit: int) -> list[str]:
        counter: Counter[str] = Counter()
        for entry in self.repository.list_all(limit=500):
            for tag in entry.tags or []:
                if isinstance(tag, str) and tag.strip():
                    counter[tag.strip()] += 1
        if not counter:
            return []
        return [item[0] for item in counter.most_common(limit)]

    @staticmethod
    def _tokenize(query: str) -> list[str]:
        tokens = [token.strip().lower() for token in re.split(r"[^a-zA-Z0-9]+", query) if token.strip()]
        return tokens[:8]

    @staticmethod
    def _score_entry(entry, tokens: list[str]) -> float:
        hay_title = (entry.title or "").lower()
        hay_desc = (entry.description or "").lower()
        hay_category = (entry.category or "").lower()
        hay_tags = " ".join([t.lower() for t in (entry.tags or []) if isinstance(t, str)])

        matched = 0
        for t in tokens:
            if t in hay_title:
                matched += 3
            elif t in hay_tags:
                matched += 2
            elif t in hay_desc:
                matched += 1
            elif t in hay_category:
                matched += 1

        if matched == 0:
            return 0.0

        base = float(entry.relevance_base or 0)
        featured_bonus = 2.0 if entry.featured else 0.0
        return float(matched) + featured_bonus + base / 100.0

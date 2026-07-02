from datetime import datetime, timezone


class PDFExportService:
    def blueprint_report_payload(self, *, blueprint_id: str, blueprint: dict) -> dict:
        generated_at = datetime.now(timezone.utc).isoformat()
        report_json = {
            "blueprint_id": blueprint_id,
            "generated_at": generated_at,
            "note": "HTML/PDF export foundation (demo). PDF rendering is TODO for production hardening.",
            "blueprint": blueprint,
        }
        report_html = self._render_simple_html(report_json)
        return {"report_json": report_json, "report_html": report_html}

    @staticmethod
    def _render_simple_html(report: dict) -> str:
        title = "GFF AI Blueprint Report"
        return f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 32px; color: #111; }}
    h1 {{ margin: 0 0 12px; }}
    pre {{ background: #f5f5f5; padding: 16px; border-radius: 10px; overflow-x: auto; }}
    .meta {{ color: #555; margin-bottom: 18px; }}
  </style>
</head>
<body>
  <h1>{title}</h1>
  <div class="meta">Generated: {report.get('generated_at')}</div>
  <pre>{_escape_html(str(report))}</pre>
</body>
</html>"""


def _escape_html(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )

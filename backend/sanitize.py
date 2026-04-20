import re


def clean_text(value: str | None) -> str | None:
    """Strip HTML tags and normalize whitespace to prevent XSS."""
    if value is None:
        return None
    value = re.sub(r'<[^>]+>', '', value)        # remove HTML tags
    value = re.sub(r'javascript\s*:', '', value, flags=re.IGNORECASE)
    value = ' '.join(value.split())              # normalize whitespace
    return value.strip() or None

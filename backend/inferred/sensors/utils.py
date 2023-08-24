from datetime import datetime

from django.utils import timezone


def aware_timestamp(timestamp_str: str) -> datetime:
    timestamp = datetime.fromisoformat(timestamp_str)
    return timezone.make_aware(timestamp, timezone.get_current_timezone())

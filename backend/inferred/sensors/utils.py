from datetime import datetime
from typing import Any

import redis
import settings  # Make sure to import your settings module
from django.conf import settings
from django.utils import timezone


def aware_timestamp(timestamp_str: str) -> datetime:
    timestamp = datetime.fromisoformat(timestamp_str)
    return timezone.make_aware(timestamp, timezone.get_current_timezone())


def create_redis_client(
    host: str = settings.REDIS_HOST,
    port: int = settings.REDIS_PORT,
    db: int = settings.REDIS_DB,
    **kwargs: Any
) -> redis.Redis:
    return redis.Redis(host=host, port=port, db=db, **kwargs)

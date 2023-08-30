from datetime import datetime
from typing import Any

import redis
from django.conf import settings
from django.utils import timezone
from rest_framework.request import Request


def aware_now() -> datetime:
    return timezone.make_aware(datetime.now(), timezone.get_current_timezone())


def aware_timestamp(timestamp_str: str) -> datetime:
    timestamp = datetime.fromisoformat(timestamp_str)
    if timestamp.tzinfo is None:
        return timezone.make_aware(timestamp, timezone.get_current_timezone())
    return timestamp


def create_redis_client(
    host: str = settings.REDIS_HOST,
    port: int = settings.REDIS_PORT,
    db: str = settings.REDIS_DB,
    **kwargs: Any
) -> redis.Redis:
    return redis.Redis(host=host, port=port, db=db, **kwargs)


class ComparisonQueryParams:
    def __init__(self, request: Request):
        start_timestamp = request.query_params.get("start_timestamp")
        self.sim_model_names = request.query_params.getlist("simulation_models[]", [])
        self.start_timestamp = aware_timestamp(start_timestamp)
        self.dim_name = request.query_params.get("dimension")
        self.duration = int(request.query_params.get("duration"))

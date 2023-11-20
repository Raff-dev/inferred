from datetime import datetime

import requests

TIMEOUT = 5
BASE_URL = "https://api.opensensorweb.de/v0/networks/luftdaten-info/devices"


target_date = datetime.strptime("2023-10-07", "%Y-%m-%d")
active_sensors = []
response = requests.get(BASE_URL, timeout=TIMEOUT)
devices = response.json()["items"]

for device in devices:
    device_name = device["name"]
    device_url = f"{BASE_URL}/{device_name}"

    device_details = requests.get(device_url, timeout=TIMEOUT).json()
    sensors_url = device_details.get("sensors_url", "")

    if not sensors_url:
        continue

    sensors_response = requests.get(sensors_url, timeout=TIMEOUT)
    sensors = sensors_response.json()["items"]

    for sensor in sensors:
        sensor_name = sensor["name"]
        sensor_url = f"{BASE_URL}/{device_name}/sensors/{sensor_name}"

        sensor_details = requests.get(sensor_url, timeout=TIMEOUT).json()
        max_time_str = sensor_details.get("sensor_stats", {}).get("max_time", "")

        if not max_time_str:
            continue

        max_time = datetime.strptime(max_time_str, "%Y-%m-%dT%H:%M:%SZ")
        if max_time > target_date:
            print(max_time, device_name, sensor_name)

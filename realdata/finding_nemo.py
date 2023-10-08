from datetime import datetime

import requests

# Initialize
base_url = "https://api.opensensorweb.de/v0/networks/luftdaten-info/devices"
target_date = datetime.strptime("2023-10-07", "%Y-%m-%d")
active_sensors = []

# Fetch list of devices
response = requests.get(base_url)
devices = response.json()["items"]

# Iterate through each device
for device in devices:
    device_name = device["name"]
    device_url = f"{base_url}/{device_name}"

    # Fetch device details to get sensors_url
    device_details = requests.get(device_url).json()
    sensors_url = device_details.get("sensors_url", "")

    if not sensors_url:
        continue

    # Fetch list of sensors for this device
    sensors_response = requests.get(sensors_url)
    sensors = sensors_response.json()["items"]

    # Iterate through each sensor
    for sensor in sensors:
        sensor_name = sensor["name"]
        sensor_url = f"{base_url}/{device_name}/sensors/{sensor_name}"

        # Fetch sensor details
        sensor_details = requests.get(sensor_url).json()
        max_time_str = sensor_details.get("sensor_stats", {}).get("max_time", "")

        if not max_time_str:
            continue

        max_time = datetime.strptime(max_time_str, "%Y-%m-%dT%H:%M:%SZ")
        if max_time > target_date:
            print(max_time, device_name, sensor_name)

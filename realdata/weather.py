import os
import time

import requests

API_KEY = os.environ.get("OPEN_WEATHER_MAP_API_KEY")
BASE_URL = "http://api.openweathermap.org/data/2.5/weather?"
CITY = "Warsaw,pl"
INTERVAL = 1

while True:
    url = f"{BASE_URL}q={CITY}&appid={API_KEY}"
    response = requests.get(url)
    if not response.status_code == 200:
        print(f"Nie udało się pobrać danych, kod statusu: {response.status_code}")
        break

    data = response.json()
    temp = data["main"]["temp"]
    weather = data["weather"][0]["description"]
    print(f"Temperatura: {temp}K, Pogoda: {weather}")
    time.sleep(INTERVAL)

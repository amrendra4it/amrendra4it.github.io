---
layout: layouts/post.njk
title: "Build a Weather CLI Using a Free API (No API Key Required)"
dek: "A command-line weather check in about 40 lines of Python, using Open-Meteo's free API."
date: 2026-07-29
readTime: "6 min read"
tags: [python, cli, apis]
---

Hitting a real API and formatting the response nicely is a core skill worth practicing on something simple before tackling bigger integrations. Weather is a great first choice — the data is naturally structured and easy to sanity-check against reality.

## What we're building

A command you run like:

```bash
python weather.py "New York"
```

...that prints the current temperature and conditions for that location.

## Why Open-Meteo

[Open-Meteo](https://open-meteo.com/) is a free weather API that needs **no API key or signup** for non-commercial use, which makes it perfect for a learning project — no account creation detour before you get to write code.

## Setup

```bash
mkdir weather-cli && cd weather-cli
pip install requests
```

## Step 1: turn a place name into coordinates

Open-Meteo's forecast endpoint needs latitude/longitude, not a city name, so we first call their free geocoding endpoint to convert one into the other:

```python
# weather.py
import requests
import sys

def get_coordinates(city_name):
    url = "https://geocoding-api.open-meteo.com/v1/search"
    response = requests.get(url, params={"name": city_name, "count": 1})
    data = response.json()

    if "results" not in data or len(data["results"]) == 0:
        return None

    result = data["results"][0]
    return {
        "lat": result["latitude"],
        "lon": result["longitude"],
        "name": result["name"],
        "country": result.get("country", ""),
    }
```

## Step 2: fetch the current weather

```python
def get_weather(lat, lon):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,weather_code,wind_speed_10m",
        "temperature_unit": "fahrenheit",
    }
    response = requests.get(url, params=params)
    return response.json()["current"]
```

## Step 3: translate weather codes into something readable

Open-Meteo returns a numeric [WMO weather code](https://open-meteo.com/en/docs) rather than a text description, so we map the common ones ourselves:

```python
WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    95: "Thunderstorm",
}

def describe_weather_code(code):
    return WEATHER_CODES.get(code, f"Unknown conditions (code {code})")
```

## Putting it together

```python
def main():
    if len(sys.argv) < 2:
        print("Usage: python weather.py <city name>")
        return

    city_name = " ".join(sys.argv[1:])
    location = get_coordinates(city_name)

    if location is None:
        print(f"Couldn't find a location matching '{city_name}'")
        return

    current = get_weather(location["lat"], location["lon"])
    description = describe_weather_code(current["weather_code"])

    print(f"Weather in {location['name']}, {location['country']}:")
    print(f"  {current['temperature_2m']}°F — {description}")
    print(f"  Wind: {current['wind_speed_10m']} mph")

if __name__ == "__main__":
    main()
```

## Try it

```bash
python weather.py "Tokyo"
```

```
Weather in Tokyo, Japan:
  78.5°F — Partly cloudy
  Wind: 8.2 mph
```

## Where to take it next

- Add a multi-day forecast using Open-Meteo's `daily` parameter instead of `current`
- Cache the geocoding lookup so repeated runs for the same city don't hit that endpoint every time
- Add colored terminal output (e.g. blue for cold, red for hot) using a package like `colorama`
- Wrap this as a real CLI command using the same `npm link`-style technique from the earlier Node.js To-Do CLI post — Python's equivalent is a console-script entry point in `setup.py` or `pyproject.toml`

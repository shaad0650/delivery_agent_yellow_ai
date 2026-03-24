import axios from "axios";
import dotenv from "dotenv"
dotenv.config();
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const DEMO_MODE = true;

const TIMEOUT_MS=5000;
const MAX_RETRIES=1;

function classifyError(error, city) {
    if (error.response) {
        const status = error.response.status;

        if (status === 404) {
            return new Error(`INVALID_CITY:${city}`);
        }
        if (status === 401) {
            return new Error(`AUTH_ERROR: Invalid API Key`);
        }
        return new Error(`API_RESPONSE_ERROR:${city}:${status}`);
    }

    if (error.code === "ECONNABORTED") {
        return new Error(`TIMEOUT_ERROR:${city}`);
    }

    if (error.request) {
        return new Error(`NETWORK_ERROR:${city}`);
    }

    return new Error(`UNKNOWN_ERROR:${city}:${error.message}`);
}
async function fetchWeatherWithRetry(city, retries = MAX_RETRIES) {
  if (process.env.DEMO_MODE === "true") {
    const demoWeatherMap = {
      "New York": "Rain",
      "Mumbai": "Thunderstorm",
      "London": "Clear"
    };

    if (demoWeatherMap[city]) {
      return demoWeatherMap[city];
    }
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: process.env.API_KEY
      },
      timeout: TIMEOUT_MS
    });

    const weather = response?.data?.weather?.[0]?.main;

    if (!weather) {
      throw new Error(`MALFORMED_RESPONSE:${city}`);
    }

    return weather;
  } catch (error) {
    const classifiedError = classifyError(error, city);
    const isRetryable =
      classifiedError.message.startsWith("NETWORK_ERROR") ||
      classifiedError.message.startsWith("TIMEOUT_ERROR");

    if (retries > 0 && isRetryable) {
      return fetchWeatherWithRetry(city, retries - 1);
    }

    throw classifiedError;
  }
}

export async function getWeather(city) {
  if (!city || typeof city !== "string") {
    throw new Error("INVALID_INPUT: city must be a non-empty string");
  }

  return fetchWeatherWithRetry(city.trim());
}
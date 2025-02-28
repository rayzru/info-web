import { fetchWeatherApi } from "openmeteo";

const params = {
  latitude: 47.257537,
  longitude: 39.712776,
  current: [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "is_day",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "weather_code",
    "cloud_cover",
    "pressure_msl",
    "surface_pressure",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
  ],
  timezone: "Europe/Moscow",
  forecast_days: 1,
};

const url = "https://api.open-meteo.com/v1/forecast";

export const fetchWeather = async () => {
  const responses = await fetchWeatherApi(url, params);

  if (responses.length === 0 || !responses[0]) {
    throw new Error("No weather data found");
  }

  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current()!;

  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
      relativeHumidity2m: current.variables(1)!.value(),
      apparentTemperature: current.variables(2)!.value(),
      isDay: current.variables(3)!.value(),
      precipitation: current.variables(4)!.value(),
      rain: current.variables(5)!.value(),
      showers: current.variables(6)!.value(),
      snowfall: current.variables(7)!.value(),
      weatherCode: current.variables(8)!.value(),
      cloudCover: current.variables(9)!.value(),
      pressureMsl: current.variables(10)!.value(),
      surfacePressure: current.variables(11)!.value(),
      windSpeed10m: current.variables(12)!.value(),
      windDirection10m: current.variables(13)!.value(),
      windGusts10m: current.variables(14)!.value(),
    },
  };

  return weatherData;
};

export type WeatherData = Exclude<Awaited<ReturnType<typeof fetchWeather>>, undefined>;

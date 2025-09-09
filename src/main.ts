import { fetchWeatherApi } from "openmeteo";

async function fetchWeatherData(
  lat: number,
  lon: number,
  start_date: string,
  end_date: string
) {
  const params = {
    // latitude: 52.52,
    // longitude: 13.41,
    latitude: lat,
    longitude: lon,
    hourly: ["temperature_2m", "relative_humidity_2m", "weather_code"],
    wind_speed_unit: "mph",
    // start_date: "2025-09-15",
    // end_date: "2025-09-16",
    start_date: start_date,
    end_date: end_date,
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const latitude = response.latitude();
  const longitude = response.longitude();
  const elevation = response.elevation();
  const utcOffsetSeconds = response.utcOffsetSeconds();

  console.log(
    `\nCoordinates: ${latitude}°N ${longitude}°E`,
    `\nElevation: ${elevation}m asl`,
    `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
  );

  const hourly = response.hourly()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    hourly: {
      time: [
        ...Array(
          (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
        ),
      ].map(
        (_, i) =>
          new Date(
            (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
              1000
          )
      ),
      temperature_2m: hourly.variables(0)!.valuesArray(),
      relative_humidity_2m: hourly.variables(1)!.valuesArray(),
      weather_code: hourly.variables(2)!.valuesArray(),
    },
  };
  return weatherData;
}

// const data = await fetchWeatherData(52.52, 13.41, "2025-09-09", "2025-09-10");
// console.log(data.hourly);

type myLocations = [
  {
    lat: number;
    lon: number;
    start_date: string;
    end_date: string;
  }
];

const myLocations = [
  {
    lat: 49.28,
    lon: 123.12,
    start_date: "2025-09-15",
    end_date: "2025-09-16",
  },
];

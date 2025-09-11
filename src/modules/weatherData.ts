import { fetchWeatherApi } from "openmeteo";

async function fetchWeatherData(
  lat: number,
  lon: number,
  start_date: string,
  end_date: string
) {
  const params = {
    latitude: lat,
    longitude: lon,
    hourly: ["temperature_2m", "relative_humidity_2m", "weather_code"],
    wind_speed_unit: "mph",
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

  const hour = 11;
  const temp = weatherData.hourly.temperature_2m![hour];
  const humidity = weatherData.hourly.relative_humidity_2m![hour];
  const weatherCode = weatherData.hourly.weather_code![hour];

  return {
    temp: temp,
    humidity: humidity,
    weatherCode: weatherCode,
  };
}

export default fetchWeatherData;

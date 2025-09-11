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
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "weather_code",
      "sunrise",
      "sunset",
    ],
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

  const daily = response.daily()!;

  const sunrise = daily.variables(3)!;
  const sunset = daily.variables(4)!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    daily: {
      time: [
        ...Array(
          (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
        ),
      ].map(
        (_, i) =>
          new Date(
            (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
              1000
          )
      ),
      temperature_2m_max: daily.variables(0)!.valuesArray(),
      temperature_2m_min: daily.variables(1)!.valuesArray(),
      weather_code: daily.variables(2)!.valuesArray(),
      // Map Int64 values to according structure
      sunrise: [...Array(sunrise.valuesInt64Length())].map(
        (_, i) =>
          new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
      ),
      // Map Int64 values to according structure
      sunset: [...Array(sunset.valuesInt64Length())].map(
        (_, i) =>
          new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
      ),
    },
  };
  console.log(weatherData);

  const highTemp = weatherData.daily.temperature_2m_max!;
  const lowTemp = weatherData.daily.temperature_2m_min!;
  const weatherCode = weatherData.daily.weather_code!;
  const sunriseTime = weatherData.daily.sunrise;
  const sunsetTime = weatherData.daily.sunset;

  return {
    highTemp: highTemp,
    lowTemp: lowTemp,
    weatherCode: weatherCode,
    sunrise: sunriseTime,
    sunset: sunsetTime,
  };
}

export default fetchWeatherData;

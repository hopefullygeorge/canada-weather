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

// ---------------------------- Geocoding API

async function fetchGeoData(cityName: string) {
  const limit = 1;
  const apiKey = "e170c773f8338f3b8ac4cf90d4622143";
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;

  const response = await fetch(geoUrl);
  if (!response.ok) {
    throw new Error("Failed to retrieve geo data");
  }

  const data = await response.json();

  // const geoLat = data[0].lat;
  // const geoLon = data[0].lon;

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    country: data[0].country,
  };
}

// ---------------------------- Form Functions

function createTravelCard(
  cityName: string,
  start: string,
  end: string,
  temp: number,
  iconUrl: string
  // weatherCode: number
) {
  const template = document.querySelector<HTMLTemplateElement>(
    "#travelCardTemplate"
  );
  if (!template) throw new Error("Missing travel card template");

  const clone = template.content.cloneNode(true) as DocumentFragment;

  const card = clone.querySelector<HTMLDivElement>(".travelCard")!;
  const titleEl = card.querySelector<HTMLHeadingElement>("h2")!;
  const imgEl = card.querySelector<HTMLImageElement>(".weatherIcon")!;
  const fromDateEl = card.querySelector<HTMLParagraphElement>(".fromDatePair")!;
  const toDateEl = card.querySelector<HTMLParagraphElement>(".toDatePair")!;
  const tempEl = card.querySelector<HTMLParagraphElement>(".temp")!;

  titleEl.innerText = cityName.toUpperCase();
  imgEl.src = iconUrl;
  imgEl.alt = `Weather for ${cityName}`;
  fromDateEl;
  toDateEl.innerText = end;
  tempEl.innerText = `${Math.round(temp)}°C`;

  return clone;
}

const form = document.querySelector("form");

form?.addEventListener("submit", async (e) => {
  // prevents default html behaviour to submit the form and cause a page refresh
  e.preventDefault();
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd);
  const city_name = obj.city_name.toString();

  const { lat, lon, country } = await fetchGeoData(city_name);
  console.log(lat, lon, city_name, country);
});

const container = document.querySelector<HTMLDivElement>("#travelContainer")!;
if (container) {
  const newCard = createTravelCard(
    "Vancouver",
    "15-09-2025",
    "16-09-2025",
    14,
    "https://maps.gstatic.com/weather/v1/cloudy.svg"
  );

  container.appendChild(newCard);
} else {
  console.error("No container found!");
}

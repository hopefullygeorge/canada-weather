import fetchWeatherData from "./modules/weatherData";
import { fetchGeoData } from "./modules/geoData";
import { cleanPlaceName } from "./modules/geoData";
import createTravelCard from "./modules/createCard";

// ----------------------------------------------------------------------------------------------------------------

const form = document.querySelector("form");
const container = document.querySelector<HTMLDivElement>(".container")!;

form?.addEventListener("submit", async (e) => {
  // prevents default html behaviour to submit the form and cause a page refresh
  e.preventDefault();
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd);
  const city_name = obj.city_name.toString();
  const start_date = obj.start_date.toString();
  const end_date = obj.end_date.toString();

  const geoObj = await fetchGeoData(city_name);

  const weatherObj = await fetchWeatherData(
    geoObj.lat,
    geoObj.lon,
    start_date,
    end_date
  );

  if (container) {
    const newCard = createTravelCard(
      cleanPlaceName(geoObj.name),
      geoObj.country,
      // This takes the date from 2025-09-11 -> dd-mm-yyyy
      start_date.replace(/T.*/, "").split("-").reverse().join("-"),
      end_date.replace(/T.*/, "").split("-").reverse().join("-"),
      // [0] represents the day of the array. i.e, if range is 7 days -> [0-6]
      weatherObj.highTemp[0],
      weatherObj.lowTemp[0],
      weatherObj.sunrise[0],
      weatherObj.sunset[0],
      weatherObj.weatherCode[0]
    );

    container.appendChild(newCard);
  } else {
    console.error("No container found!");
  }
});

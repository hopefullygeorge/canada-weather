import fetchWeatherData from "./modules/weatherData";
import fetchGeoData from "./modules/geoData";
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
      city_name,
      start_date,
      end_date,
      weatherObj.temp,
      "https://maps.gstatic.com/weather/v1/cloudy.svg"
    );

    container.appendChild(newCard);
  } else {
    console.error("No container found!");
  }
});

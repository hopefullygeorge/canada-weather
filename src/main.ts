import fetchWeatherData from "./modules/weatherData";
import { fetchGeoData } from "./modules/geoData";
import createTravelCard from "./modules/createCard";

// ----------------------------------------------------------------------------------------------------------------

const form = document.querySelector("form");
const plusButton = document.querySelector(".plusButton");
const formWrapper = document.querySelector<HTMLDivElement>(".formWrapper");
const container = document.querySelector<HTMLDivElement>(".container")!;

plusButton?.addEventListener("click", () => {
  const btnRect = plusButton.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  if (formWrapper) {
    formWrapper.style.top = `${btnRect.top - containerRect.top}px`;
    formWrapper.style.left = `${btnRect.left - containerRect.left}px`;
  }

  plusButton.classList.toggle("transparent");
  form?.classList.toggle("visible");
  console.log("I have been pressed.");
});

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
      geoObj.name,
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
    container.insertBefore(newCard, plusButton!);
  }

  //   container.appendChild(newCard);
  // } else {
  //   console.error("No container found!");
  // }

  form.classList.remove("visible");
  plusButton?.classList.remove("transparent");
});

type TripStop = {
  cityName: string;
  startDate: string;
  endDate: string;
};

const tripPlan: TripStop[] = [
  { cityName: "Vancouver, CA", startDate: "2025-09-15", endDate: "2025-09-16" },
  { cityName: "Whistler, CA", startDate: "2025-09-16", endDate: "2025-09-18" },
  { cityName: "Ashcroft, CA", startDate: "2025-09-18", endDate: "2025-09-19" },
  {
    cityName: "Wells Gray, CA",
    startDate: "2025-09-19",
    endDate: "2025-09-21",
  },
  { cityName: "Jasper, CA", startDate: "2025-09-21", endDate: "2025-09-24" },
  {
    cityName: "Lake Louise, CA",
    startDate: "2025-09-24",
    endDate: "2025-09-25",
  },
  { cityName: "Banff, CA", startDate: "2025-09-25", endDate: "2025-09-27" },
  {
    cityName: "Revelstoke, CA",
    startDate: "2025-09-27",
    endDate: "2025-09-27",
  },
  // {cityName: "Okanagan Valley, CA", startDate: "2025-09-29", endDate: "2025-09-30"},
  // {cityName: "Hope, CA", startDate: "2025-09-30", endDate: "2025-09-30"},
  // {cityName: "Harrison Hot Springs, CA", startDate: "2025-09-30", endDate: "2025-10-02"},
  // {cityName: "Vancouver, CA", startDate: "2025-10-02", endDate: "2025-10-03"},
];

window.addEventListener("DOMContentLoaded", async () => {
  for (const stop of tripPlan) {
    const geoObj = await fetchGeoData(stop.cityName);
    const weatherObj = await fetchWeatherData(
      geoObj.lat,
      geoObj.lon,
      stop.startDate,
      stop.endDate
    );

    const newCard = createTravelCard(
      geoObj.name,
      geoObj.country,
      stop.startDate.split("-").reverse().join("-"), // convert to DD-MM-YYYY
      stop.endDate.split("-").reverse().join("-"),
      weatherObj.highTemp[0],
      weatherObj.lowTemp[0],
      weatherObj.sunrise[0],
      weatherObj.sunset[0],
      weatherObj.weatherCode[0]
    );

    // Insert each card before the plus button so order is preserved
    const plusButton = document.querySelector(".plusButton");
    if (plusButton) {
      container.insertBefore(newCard, plusButton);
    } else {
      container.appendChild(newCard);
    }
  }
});

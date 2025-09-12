import { getWeatherIcon } from "./weatherTable";

function createTravelCard(
  cityName: string,
  country: string,
  start: string,
  end: string,
  highTemp: number,
  lowTemp: number,
  sunrise: Date,
  sunset: Date,
  weatherCode: number
) {
  const template = document.querySelector<HTMLTemplateElement>(
    "#travelCardTemplate"
  );
  if (!template) throw new Error("Missing travel card template");

  const clone = template.content.cloneNode(true) as DocumentFragment;

  const card = clone.querySelector<HTMLDivElement>(".travelCard")!;
  const delBtnEl = card.querySelector<HTMLButtonElement>(".delBtn")!;
  const titleEl = card.querySelector<HTMLHeadingElement>("h2")!;
  const h3TitleEl = card.querySelector<HTMLHeadingElement>("h3")!;
  const imgEl = card.querySelector<HTMLImageElement>(".weatherIcon")!;

  const fromDateDiv = card.querySelector<HTMLDivElement>(".fromDatePair")!;
  const fromLabel = card.querySelector<HTMLParagraphElement>(".fromP")!;
  const fromDate = card.querySelector<HTMLParagraphElement>(".fromDate")!;

  const toDateDiv = card.querySelector<HTMLDivElement>(".toDatePair")!;
  const toLabel = card.querySelector<HTMLParagraphElement>(".toP")!;
  const toDate = card.querySelector<HTMLParagraphElement>(".toDate")!;
  const tempDiv = card.querySelector<HTMLDivElement>(".weatherData")!;

  const highTempDiv = card.querySelector<HTMLDivElement>(".highTempPair")!;
  const highLabel = card.querySelector<HTMLParagraphElement>(".highP")!;
  const highTempP = card.querySelector<HTMLParagraphElement>(".highTemp")!;

  const lowTempDiv = card.querySelector<HTMLDivElement>(".lowTempPair")!;
  const lowLabel = card.querySelector<HTMLParagraphElement>(".lowP")!;
  const lowTempP = card.querySelector<HTMLParagraphElement>(".lowTemp")!;

  console.debug(
    sunrise,
    sunset,
    fromDateDiv,
    fromLabel,
    toDateDiv,
    toLabel,
    tempDiv,
    highTempDiv,
    highLabel,
    lowTempDiv,
    lowLabel
  );
  delBtnEl.style.backgroundImage = "assets/UI/radix_cross-2.svg";

  titleEl.innerText = cityName.toUpperCase();
  if (cityName.length > 15) {
    titleEl.style.fontSize = "15px";
  }

  const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
    type: "region",
  });
  h3TitleEl.innerText = regionNamesInEnglish.of(country) ?? country;

  // imgEl.src = "https://maps.gstatic.com/weather/v1/cloudy.svg";
  imgEl.src = getWeatherIcon(weatherCode);
  imgEl.alt = `Weather for ${cityName}`;

  fromDate.innerText = start;
  toDate.innerText = end;

  lowTempP.innerText = `${Math.round(lowTemp)}°C`;
  highTempP.innerText = `${Math.round(highTemp)}°C`;

  delBtnEl.addEventListener("click", () => {
    const travelCard = delBtnEl.closest(".travelCard");
    if (travelCard) {
      travelCard.classList.add("removing");
      setTimeout(() => travelCard.remove(), 300);
    }
  });

  return clone;
}

export default createTravelCard;

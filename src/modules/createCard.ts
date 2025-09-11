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
  fromDateEl.innerText = start;
  toDateEl.innerText = end;
  tempEl.innerText = `${Math.round(temp)}°C`;

  return clone;
}

export default createTravelCard;

export async function fetchGeoData(cityName: string) {
  const limit = 1;
  const apiKey = "e170c773f8338f3b8ac4cf90d4622143";
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;

  const response = await fetch(geoUrl);
  if (!response.ok) {
    throw new Error("Failed to retrieve geo data");
  }

  const data = await response.json();

  console.log(data);

  return {
    name: data[0].name,
    lat: data[0].lat,
    lon: data[0].lon,
    country: data[0].country,
  };
}

export function cleanPlaceName(name: string): string {
  return name
    .replace(/ Resort Municipality$/i, "")
    .replace(/ Municipality$/i, "")
    .replace(/ City$/i, "")
    .replace(/ County$/i, "")
    .replace(/ District$/i, "")
    .replace(/ Census Division$/i, "")
    .trim();
}

// export default fetchGeoData;

export async function fetchGeoData(cityName: string) {
  const tidyString = cityName.replace(/ /g, "+");
  const limit = 1;
  const apiKey = "e170c773f8338f3b8ac4cf90d4622143";
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${tidyString}&limit=${limit}&appid=${apiKey}`;

  console.log(tidyString);

  const response = await fetch(geoUrl);
  if (!response.ok) {
    throw new Error("Failed to retrieve geo data");
  }

  const data = await response.json();

  return {
    name: data[0].name,
    lat: data[0].lat,
    lon: data[0].lon,
    country: data[0].country,
  };
}

// export default fetchGeoData;

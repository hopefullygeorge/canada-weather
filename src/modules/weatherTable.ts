export const weatherIconMap: Record<number, string> = {
  // 0: Clear sky
  0: "clear_alt.svg",

  // 1,2,3: Mainly clear, partly cloudy, overcast
  1: "mostly_clear_alt.svg",
  2: "partly_cloudy.svg",
  3: "cloudy.svg",

  // 45,48: Fog and depositing rime fog
  45: "fog.svg",
  48: "fog.svg",

  // 51,53,55: Drizzle (light, moderate, dense)
  51: "drizzle.svg",
  53: "drizzle.svg",
  55: "drizzle.svg",

  // 56,57: Freezing drizzle
  56: "icy.svg",
  57: "icy.svg",

  // 61,63,65: Rain (slight, moderate, heavy)
  61: "showers.svg",
  63: "showers.svg",
  65: "showers.svg",

  // 66,67: Freezing rain
  66: "icy.svg",
  67: "icy.svg",

  // 71,73,75: Snowfall (slight, moderate, heavy)
  71: "snow_showers.svg",
  73: "snow_showers.svg",
  75: "heavy_snow.svg",

  // 77: Snow grains
  77: "flurries.svg",

  // 80,81,82: Rain showers (slight, moderate, violent)
  80: "scattered_showers.svg",
  81: "scattered_showers.svg",
  82: "showers.svg",

  // 85,86: Snow showers (slight, heavy)
  85: "snow_showers.svg",
  86: "heavy_snow.svg",

  // 95: Thunderstorm (slight/moderate)
  95: "isolated_tstorms.svg",

  // 96,99: Thunderstorm with hail
  96: "strong_tstorms.svg",
  99: "strong_tstorms.svg",
};

export function getWeatherIcon(code: number): string {
  return `/assets/${weatherIconMap[code] ?? "cloudy.svg"}`;
}

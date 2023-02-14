// useful?
// type ForecastType = 'wind' | 'wave' | 'rating' | 'tides' | 'weather';

export type ForecastQuery = {
  days: number;
  intervalHours: number;
};

type Units = {
  // TODO: are there other values that are ever returned? 
  temperature: "F",
  tideHeight: "FT",
  swellHeight: "FT",
  waveHeight: "FT",
  windSpeed: "KTS",
  pressure: "MB"
};

type Location = {
  lon: number,
  lat: number,
};

type Wind = {
  timestamp: number,
  utcOffset: number,
  speed: number,
  direction: number,
  directionType: string // could be an enum: "Onshore", ...
  gust: number,
  optimalScore: number
};

export type WindForecast = {
  associated: {
    units: Units,
    utcOffset: number,
    location: Location,
    runInitializationTimestamp: number
  },
  data: {
    wind: Wind[]
  }
};

type Swell = {
  height: number,
  period: number,
  impact: number,
  direction: number,
  directionMin: number,
  optimalScore: number,
};

type Wave = {
  timestamp: number,
  probability: null,
  utcOffset: number,
  surf: {
    min: number,
    max: number,
    optimalScore: number,
    plus: boolean,
    humanRelation: string, // eg. "Waist to chest",
    raw: {
      min: number,
      max: number
    }
  }
  swells: Swell[]
};

export type WaveForecast = {
  associated: {
    units: Units,
    utcOffset: number,
    location: Location,
    runInitializationTimestamp: number,
    forecastLocation: Location,
    offshoreLocation: Location,
  },
  data: {
    wave: Wave[]
  }
};

type Rating = {
  timestamp: number,
  utcOffset: number,
  rating: {
    key: string // eg. "FAIR", TODO: probably useful and easy to make an enum
    value: 3
  }
};

export type RatingForecast = {
  associated: {
    location: Location,
    runInitializationTimestamp: number,
  },
  data: {
    rating: Rating[]
  }
};

type Tide = {
  timestamp: number,
  utcOffset: number,
  type: 'HIGH' | 'LOW' | 'NORMAL',
  height: number
};

export type TideForecast = {
  associated: {
    utcOffset: number,
    units: Units,
    tideLocation: Location & {
      name: string,
      min: number,
      max: number,
      mean: number
    }
  },
  data: {
    tides: Tide[],
  }
};

type SunriseSunsetTimes = {
  midnight: number,
  sunrise: number,
  sunset: number,
};

type SunlightTimes = SunriseSunsetTimes & {
  midnightUTCOffset: number,
  dawn: number,
  dawnUTCOffset: number,
  sunriseUTCOffset: number,
  sunsetUTCOffset: number,
  dusk: number,
  duskUTCOffset: number,
};


type Weather = {
  timestamp: number,
  utcOffset: number,
  temperature: number,
  condition: string, // eg. "NIGHT_MOSTLY_CLOUDY",
  pressure: number
};

export type WeatherForecast = {
  associated: {
    units: Units,
    utcOffset: number,
    weatherIconPath: string,
    runInitializationTimestamp: number,
  },
  data: {
    sunlightTimes: SunlightTimes[],
    weather: Weather[],
  }
};

type Forecast = {
  timestamp: number,
  weather: Pick<Weather, 'temperature' | 'condition'>,
  wind: Pick<Wind, 'speed' | 'direction'>,
  surf: Wave['surf']['raw'],
  swells: Pick<Swell, 'height' | 'period' | 'direction' | 'directionMin'>[]
};

export type CombinedForecast = {
  associated: {
    units: Units,
    utcOffset: number,
    weatherIconPath: string,
  },
  data: {
    sunriseSunsetTimes: SunriseSunsetTimes[],
    tideLocation: TideForecast['associated']['tideLocation'],
    forecasts: Forecast[],
    tides: Pick<Tide, 'timestamp' | 'type' | 'height'>
  }
};

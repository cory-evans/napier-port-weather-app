export interface JsonTideNow {
  Success: boolean;
  ErrorMessage: string;
  Tide: JsonTide;
}

export interface JsonTide {
  DateReading: string;
  TideWharf1: number;
  TideWharf3: number;
  TideDefault: number;
  TideWharf1UpDown: number;
  TideWharf3UpDown: number;
  TideDefaultUpDown: number;
}

export interface JsonWaveNow {
  Success: boolean;
  ErrorMessage: string;
  Wave: JsonWave;
}

export interface JsonWave {
  DateReading: string;
  CurrentBuoy: string;
  MaximumWaveHeight: number;
  SignificantWaveHeight: number;
  PeakEnergyPeriod: number;
  MeanTrueDirection: number;
}

export interface JsonWindNow {
  Success: boolean;
  ErrorMessage: string;
  Wind: JsonWind;
}

export interface JsonWind {
  WindSpeedActual: number;
  WindGustActual: number;
  WindDirectionActual: number;
  DateReading: string;
  CompassDirection: string;
  BarometerAtmosphericPressure: number;
  BarometerAtmosphericPressureUpDown: number;
}

export interface JsonSwellNow {
  Success: boolean;
  ErrorMessage: string;
  Swell: JsonSwell;
}

export interface JsonSwell {
  SwellMeanTrueDirection: number;
  SwellAvgHeight: number;
  SwellPeakPeriod: number;
  DateReading: string;
  CurrentBuoy: string;
}

export interface JsonRainNow {
  Success: boolean;
  ErrorMessage: string;
  Rain: JsonRain;
}

export interface JsonRain {
  AirTemperature: number;
  Humidity: number;
  RainIntensityMMPerHour: number;
  RainAccumulationOver24Hours: number;
  RainAccumulationOver7Days: number;
  DateReading: string;
}

export interface JsonWeatherNow {
  Success: boolean;
  ErrorMessage: string;
  WindLast20MinAvgSpeed: number;
  WindLast20MinAvgGust: number;
  Wind: JsonWind;
}

export interface JsonWindHoursMinutes {
  Success: boolean;
  ErrorMessage: string;
  Hours: number;
  Minutes: number;
  RecordCount: number;
  WindData: JsonWind[];
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentBuoyService } from './current-buoy.service';
import {
  Observable,
  ReplaySubject,
  forkJoin,
  interval,
  of,
  shareReplay,
  switchMap,
  take,
  timer,
} from 'rxjs';
import {
  JsonRainNow,
  JsonSwellNow,
  JsonTideNow,
  JsonWaveNow,
  JsonWeatherNow,
  JsonWindHoursMinutes,
  JsonWindNow,
} from '../weather.models';

interface WeatherSubject {
  tide: JsonTideNow;
  wave: JsonWaveNow;
  wind: JsonWindNow;
  swell: JsonSwellNow;
  rain: JsonRainNow;
  // weather: JsonWeatherNow;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private api_base_url = 'https://weatherapi.napierport.co.nz';

  public weather$: Observable<WeatherSubject> = timer(0, 1000 * 60).pipe(
    switchMap(() => this.weather_now_joined()),
    shareReplay(1)
  );

  constructor(
    private http: HttpClient,
    private buoyService: CurrentBuoyService
  ) {}

  private get<T>(endpoint: string) {
    return this.http.get<T>(this.api_base_url + endpoint, {
      headers: {
        Accept: 'application/json',
      },
    });
  }

  private weather_now_joined() {
    return forkJoin({
      tide: this.tide_now(),
      wave: this.wave_now(),
      wind: this.wind_now(),
      swell: this.swell_now(),
      rain: this.rain_now(),
      // weather: this.weather_now(),
    });
  }

  tide_now() {
    return this.get<JsonTideNow>('/tide/now');
  }

  wave_now() {
    return this.buoyService.current_buoy$.pipe(
      take(1),
      switchMap((buoy) => this.get<JsonWaveNow>('/wave/now/' + buoy))
    );
  }

  wind_now() {
    return this.get<JsonWindNow>('/wind/now');
  }

  private _wind_last_24_hours$ = this.get<JsonWindHoursMinutes>(
    '/wind/lastday'
  ).pipe(shareReplay(1));

  wind_last_24_hours(): Observable<JsonWindHoursMinutes> {
    return this._wind_last_24_hours$;
  }

  swell_now() {
    return this.buoyService.current_buoy$.pipe(
      take(1),
      switchMap((buoy) => this.get<JsonSwellNow>('/swell/now/' + buoy))
    );
  }

  rain_now() {
    return this.get<JsonRainNow>('/rain/now');
  }

  weather_now() {
    return this.get<JsonWeatherNow>('/weather/now');
  }
}

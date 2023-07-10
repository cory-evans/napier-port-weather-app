import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Color, ScaleType } from '@stoick/ngx-15-charts';
import { WeatherService } from '../shared/services/weather.service';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  map,
  shareReplay,
  tap,
} from 'rxjs';

import { DateTime } from 'luxon';
import { ClientWindowSizeService } from '../shared/services/client-window-size.service';
import { NoSleepService } from '../shared/services/no-sleep.service';
import NoSleep from 'nosleep.js';

@Component({
  selector: 'app-wind-dashboard',
  templateUrl: './wind-dashboard.component.html',
  host: {
    class: 'd-flex flex-column',
  },
})
export class WindDashboardComponent {
  nav_height = 56;

  hours_to_display = 4;
  wind_data_to_use$ = this.api.wind(this.hours_to_display).pipe(
    map((windData) => windData.WindData),
    map((windData) => windData.reverse()),
    shareReplay(1)
  );

  latest_wind_data$ = this.wind_data_to_use$.pipe(
    map((windData) => windData[windData.length - 1])
  );

  data$ = this.wind_data_to_use$.pipe(
    map((windData) => {
      const latest = DateTime.fromISO(
        windData[windData.length - 1].DateReading
      );

      const earliest = latest.minus({ hours: this.hours_to_display });

      // filter
      windData = windData.filter((x) => {
        const dt = DateTime.fromISO(x.DateReading);
        return dt >= earliest;
      });

      return windData;
    }),
    map((windData) => {
      // create ticks for every hour starting with the latest hour and going back 24 hours
      const latest = DateTime.fromISO(
        windData[windData.length - 1].DateReading
      );
      const ticks = [];
      for (let i = 0; i < this.hours_to_display; i++) {
        ticks.push(latest.minus({ hours: i }).toFormat('HH:00'));
      }

      const data = windData.map((wind) => ({
        name: DateTime.fromISO(wind.DateReading).toFormat('HH:mm'),
        value: wind.WindSpeedActual,
      }));

      return { data: [{ name: 'Wind Speed', series: data }], ticks };
    })
  );

  constructor(
    private api: WeatherService,
    private clientWindowSizeService: ClientWindowSizeService,
    private nosleepService: NoSleepService
  ) {}

  element_height$ = this.clientWindowSizeService.size$.pipe(
    map((size) => size.height - this.nav_height),
    map((height) => height / 2 - 1)
  );

  isPortrait$ = this.clientWindowSizeService.isPortrait$;

  element_size$ = combineLatest([
    this.clientWindowSizeService.size$,
    this.clientWindowSizeService.isPortrait$,
  ]).pipe(
    map(([size, isPortrait]) => {
      const height = size.height - this.nav_height;
      const width = size.width;

      if (isPortrait) {
        return { height: height / 2 + 'px', width: '100%' };
      } else {
        return { height: '100%', width: width / 2 + 'px' };
      }
    })
  );

  colorScheme: string | Color = {
    domain: ['#0d6efd'],
    selectable: false,
    group: ScaleType.Linear,
    name: 'cool',
  };

  noSleepEnabled = false;
  toggleNoSleep() {
    setTimeout(() => {
      if (this.noSleepEnabled) {
        this.nosleepService.enable();
      } else {
        this.nosleepService.disable();
      }

      setTimeout(() => {
        this.noSleepEnabled = this.nosleepService.noSleep.isEnabled;
      }, 250);
    }, 1);
  }
}

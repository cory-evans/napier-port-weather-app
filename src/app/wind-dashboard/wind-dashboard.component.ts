import { Component, ElementRef, ViewChild } from '@angular/core';
import { Color, ScaleType } from '@stoick/ngx-15-charts';
import { WeatherService } from '../shared/services/weather.service';
import { Subject, map, shareReplay, tap } from 'rxjs';

import { DateTime } from 'luxon';
import { ClientWindowSizeService } from '../shared/services/client-window-size.service';

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
    private clientWindowSizeService: ClientWindowSizeService
  ) {}

  element_height$ = this.clientWindowSizeService.size$.pipe(
    map((size) => size.height - this.nav_height),
    map((height) => (height / 2) - 1)
  );

  colorScheme: string | Color = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
    selectable: false,
    group: ScaleType.Linear,
    name: 'cool',
  };
}

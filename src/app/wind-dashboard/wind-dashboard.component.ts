import { Component, ElementRef, ViewChild } from '@angular/core';
import { Color, ScaleType } from '@stoick/ngx-15-charts';
import { WeatherService } from '../shared/services/weather.service';
import { Subject, map, tap } from 'rxjs';

import { DateTime } from 'luxon';

@Component({
  selector: 'app-wind-dashboard',
  templateUrl: './wind-dashboard.component.html',
})
export class WindDashboardComponent {
  hours_to_display = 4;
  data$ = this.api.wind_last_24_hours().pipe(
    map((x) => x.WindData.reverse()),
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

  constructor(private api: WeatherService) {}

  colorScheme: string | Color = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
    selectable: false,
    group: ScaleType.Linear,
    name: 'cool',
  };
}

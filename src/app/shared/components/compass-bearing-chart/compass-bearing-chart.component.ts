import { Component } from '@angular/core';
import * as shape from 'd3-shape';
import { map, of } from 'rxjs';
import { DateTime } from 'luxon';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-compass-bearing-chart',
  templateUrl: './compass-bearing-chart.component.html',
})
export class CompassBearingChartComponent {
  curve = shape.curveLinear;

  constructor(private api: WeatherService) {}

  data$ = this.api.wind_last_24_hours().pipe(
    map((windData) => windData.WindData),
    map((windData) => windData.reverse()),
    map((windData) => {
      // take the first 30 elements
      windData = windData.slice(0, 30);
      return windData;
    }),
    map((windData) =>
      windData.map((wind) => ({
        name: wind.WindDirectionActual,
        value: wind.WindSpeedActual,
      }))
    ),
    map((windData) => {
      // create ticks
      const ticks = [];
      for (let i = 0; i < 360; i++) {
        ticks.push(i);
      }

      return {
        data: [{ name: 'Wind Speed', series: windData }],
        ticks,
      };
    })
  );

  cardinalDirections = [
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
    'N',
    'NNE',
    'NE',
    'ENE',
  ];

  directions = this.cardinalDirections.map((direction, index) => ({
    name: direction,
    x: Math.cos((index * 22.5 * Math.PI) / 180),
    y: Math.sin((index * 22.5 * Math.PI) / 180),
  }));

  radius = 50;
  polyline_points$ = this.api.wind_last_24_hours().pipe(
    map((windData) => windData.WindData),
    map((windData) => windData.reverse()),
    map((windData) => windData.slice(0, 50)),
    map((windData) => {
      const first = windData[0];
      const last = windData[windData.length - 1];

      const data = [];
      for (let i = 0; i < windData.length; i++) {
        const wind = windData[i];
        const magnitude = i / windData.length;
        const x =
          Math.cos((wind.WindDirectionActual * Math.PI) / 180) *
          this.radius *
          magnitude;
        const y =
          Math.sin((wind.WindDirectionActual * Math.PI) / 180) *
          this.radius *
          magnitude;
        data.push({
          x: x + this.radius,
          y: y + this.radius,
        });
      }

      return data;
    }),
    map((points) => {
      return points.map((p) => `${p.x},${p.y}`).join(' ');
    })
  );

  clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}

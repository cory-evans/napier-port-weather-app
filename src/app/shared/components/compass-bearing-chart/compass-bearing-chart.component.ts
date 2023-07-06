import { Component, Input, OnInit } from '@angular/core';
import * as shape from 'd3-shape';
import { Observable, map, of, shareReplay } from 'rxjs';
import { JsonWind } from '../../weather.models';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-compass-bearing-chart',
  templateUrl: './compass-bearing-chart.component.html',
  host: {},
})
export class CompassBearingChartComponent implements OnInit {
  curve = shape.curveLinear;

  @Input() wind_data_to_use$?: Observable<JsonWind[]>;

  constructor() {}

  ngOnInit(): void {
    this.current_dir_triangle_points$ = this.wind_data_to_use$?.pipe(
      map((windData) => {
        const last = windData[windData.length - 1];

        const vector = {
          x: Math.cos((last.WindDirectionActual * Math.PI) / 180),
          y: Math.sin((last.WindDirectionActual * Math.PI) / 180),
        };

        const closer_point = {
          x: this.radius,
          y: this.radius,
        };

        const farther_point = {
          x: this.radius + vector.x * this.radius * 1.1,
          y: this.radius + vector.y * this.radius * 1.1,
        };

        return [closer_point, farther_point];
      })
    );

    this.polyline_points$ = this.wind_data_to_use$?.pipe(
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

    this.rings$ = this.wind_data_to_use$?.pipe(
      map((windData) => {
        const place_ring_every_x_minutes = 60;
        const now = DateTime.local();

        const last = windData[windData.length - 1];
        const first = windData[0];

        // put rings on every hour
        const last_reading = DateTime.fromISO(last.DateReading);
        const first_reading = DateTime.fromISO(first.DateReading);

        const diff = now.diff(first_reading, ['minutes']);

        const noOfRings = Math.ceil(diff.minutes / place_ring_every_x_minutes);
        const offset = (diff.minutes % place_ring_every_x_minutes) / noOfRings;

        const gap = this.radius / noOfRings;

        return Array.from({ length: noOfRings }, (_, i) => i).map((i) => {
          return i * gap + offset;
        });
      }),
      map((rings) => {
        return rings.filter((r) => r < this.radius && r > 0);
      })
    );
  }

  cardinalDirections = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'];

  directions = this.cardinalDirections.map((direction, index) => ({
    name: direction,
    x: Math.cos((index * 45 * Math.PI) / 180),
    y: Math.sin((index * 45 * Math.PI) / 180),
  }));

  radius = 50;

  polyline_points$?: Observable<string>;

  current_dir_triangle_points$?: Observable<
    {
      x: number;
      y: number;
    }[]
  >;

  segments = Array.from({ length: 8 }, (_, i) => i).map((i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const x = Math.cos(angle) * this.radius;
    const y = Math.sin(angle) * this.radius;
    return { x, y };
  });

  rings$?: Observable<number[]>;

  clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}

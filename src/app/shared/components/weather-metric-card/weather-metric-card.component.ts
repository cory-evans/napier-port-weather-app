import { Component, Input } from '@angular/core';

@Component({
  selector: 'weather-metric-card',
  templateUrl: './weather-metric-card.component.html',
})
export class WeatherMetricCardComponent {
  @Input() header?: string;

  @Input() icon?: string;
  @Input() value?: string | number | null;
  @Input() unit?: string;
}

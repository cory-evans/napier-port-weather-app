import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WeatherService } from '../shared/services/weather.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  weather$: typeof this.api.weather$;

  constructor(private api: WeatherService) {
    this.weather$ = this.api.weather$;
  }
}

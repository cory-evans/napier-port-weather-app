import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherMetricCardComponent } from './components/weather-metric-card/weather-metric-card.component';

@NgModule({
  declarations: [WeatherMetricCardComponent],
  imports: [CommonModule],
  exports: [WeatherMetricCardComponent],
})
export class SharedModule {}

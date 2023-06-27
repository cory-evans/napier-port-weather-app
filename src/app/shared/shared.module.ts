import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherMetricCardComponent } from './components/weather-metric-card/weather-metric-card.component';
import { CompassBearingChartComponent } from './components/compass-bearing-chart/compass-bearing-chart.component';
import { NgxChartsModule } from '@stoick/ngx-15-charts';

@NgModule({
  declarations: [WeatherMetricCardComponent, CompassBearingChartComponent],
  imports: [CommonModule, NgxChartsModule],
  exports: [WeatherMetricCardComponent, CompassBearingChartComponent],
})
export class SharedModule {}

import { Component, HostListener } from '@angular/core';
import { ClientWindowSizeService } from './shared/services/client-window-size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'napier-port-weather';

  constructor(private windowSizeService: ClientWindowSizeService) {
    this.windowSizeService.set_size(window.innerWidth, window.innerHeight);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const width = event.target.innerWidth;
    const height = event.target.innerHeight;
    this.windowSizeService.set_size(width, height);
  }
}

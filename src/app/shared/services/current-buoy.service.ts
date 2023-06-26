import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentBuoyService {
  constructor() {
    this.current_buoy$.next('TAS6922');
  }

  current_buoy$ = new ReplaySubject<string>(1);
}

import { Injectable } from '@angular/core';
import NoSleep from 'nosleep.js';

@Injectable({
  providedIn: 'root',
})
export class NoSleepService {
  noSleep = new NoSleep();

  constructor() {}

  disable() {
    this.noSleep.disable();
  }

  enable() {
    this.noSleep.enable();
  }
}

import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientWindowSizeService {
  private current_size$ = new ReplaySubject<{
    width: number;
    height: number;
  }>();

  constructor() {}

  public get size$() {
    return this.current_size$.asObservable();
  }

  public set_size(width: number, height: number) {
    this.current_size$.next({ width, height });
  }
}

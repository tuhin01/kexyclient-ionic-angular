import { Injectable } from '@angular/core';
import { Geolocation, Geoposition, GeolocationOptions } from "@ionic-native/geolocation";

declare var google;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }
}

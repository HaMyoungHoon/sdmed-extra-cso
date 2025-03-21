import {afterNextRender, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, Output, Renderer2} from "@angular/core";
import * as FConstants from "../../../guards/f-constants";
import * as FGoogleMapStyle from "../../../guards/f-google-map-style";
import * as FExtensions from "../../../guards/f-extensions";
import {DOCUMENT} from "@angular/common";
import {GoogleSetMarkerModel} from "../../../models/common/google-set-marker-model";
declare global {
  interface Window {
    googleInitMap: (data: any) => Promise<void>;
    googleMapClick: (data: any) => Promise<void>;
    googleSetReverseGeocoder: () => Promise<void>;
    googleOpenInfoWindow: (data: string, position: any) => Promise<void>;
    googleSetMarker: (markerModel: GoogleSetMarkerModel[]) => Promise<void>;
    google: any;
    googleMap: any;
    googleGeocoder: any;
    googlePosition: { lat: number, lng: number };
    googleInfoWindow: any;
    googleMarker: any[];
    googleDefTheme: any;
  }
}

@Component({
  selector: "app-google-map",
  imports: [],
  templateUrl: "./google-map.component.html",
  styleUrl: "./google-map.component.scss",
  standalone: true,
})
export class GoogleMapComponent implements AfterViewInit, OnDestroy {
  mapLoadTimeout: number = 0;
  googleMarker: any[] = [];
  selectedTheme: any;
  isMobile: boolean = false;
  @Input() themeNumber: number = 0;
  @Output() error: EventEmitter<{title: string, msg?: string}> = new EventEmitter();
  @Output() warn: EventEmitter<{title: string, msg?: string}> = new EventEmitter();
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private cd: ChangeDetectorRef) {
    window.googlePosition = FConstants.DEF_POSITION;
    this.selectedTheme = this.getSelectedTheme(this.themeNumber);
    afterNextRender(() => {
      this.cd.markForCheck();
    });
  }

  onError(title: string, msg?: string): void {
    this.error.next({title: title, msg: msg});
  }
  onWarn(title: string, msg?: string): void {
    this.warn.next({title: title, msg: msg});
  }
  ngAfterViewInit(): void {
    window.googleInitMap = this.googleInitMap;
    window.googleMapClick = this.googleMapClick;
    window.googleSetReverseGeocoder = this.googleSetReverseGeocoder;
    window.googleOpenInfoWindow = this.googleOpenInfoWindow;
    window.googleSetMarker = this.googleSetMarker;
    window.googleMarker = this.googleMarker;
    this.googleInitMap().then((_: void): void => {
      this.cd.detectChanges();
    });
    this.isMobile = !navigator.userAgent.includes("Window");
  }
  ngOnDestroy(): void {

  }

  async googleInitMap(): Promise<void> {
    this.mapLoadTimeout = 0;
    while (window.google === undefined) {
      await FExtensions.awaitDelay(1000);
      if (this.mapLoadTimeout > 10) {
        break;
      }
      this.mapLoadTimeout++;
    }
    if (window.google === undefined) {
      return;
    }

    window.googleMap = new window.google.maps.Map(document.getElementById("google-map-view"), {
      center: window.googlePosition,
      zoom: 15,
      mapId: FConstants.MAP_GOOGLE_ID,
      disableDefaultUI: true,
      scaleControl: true,
      zoomControl: true,
      options: {
        gestureHandling: "greedy"
      }
    });
    window.google.maps.importLibrary("marker");
    window.googleGeocoder = new window.google.maps.Geocoder();
    window.googleInfoWindow = new window.google.maps.InfoWindow({
      content: `${window.googlePosition}`,
      position: window.googlePosition
    });
    window.googleMap.addListener("click", (x: any): void => {
      this.googleMapClick(x);
    });
    await FExtensions.awaitDelay(1000);
  }

  async googleMapClick(data: any): Promise<void> {
    window.googlePosition = data.latLng;
//    await this.googleSetReverseGeocoder();
  }
  async googleSetReverseGeocoder(): Promise<void> {
    await window.googleGeocoder.geocode({ location: window.googlePosition }).then((x: any) => {
      let geoResult = "";
      let skip = 0;
      x.results.forEach((y: any) => {
        if (skip < 3) {
          geoResult += `<div class="flex">${y.formatted_address}</div>`;
        }
        skip++;
      });

      const infoContent = `
<div id="content" class="card flex-row">
    <div id="siteNotice"></div>
    <h5 id="firstHeading" class="firstHeading">${window.googlePosition}</h5>
    <div id="bodyContent" class="card flex-row">
        ${geoResult}
    </div>
</div>`;
      this.googleOpenInfoWindow(infoContent);
      return infoContent;
    }).catch((x: any) => {
      this.onError("geocoder", x);
    });
  }
  async googleOpenInfoWindow(content: string, position: any = undefined): Promise<void> {
    let positionBuff = position;
    if (position === undefined) {
      positionBuff = window.googlePosition;
    }
    try {
      window.googleInfoWindow?.close();
      window.googleInfoWindow = new window.google.maps.InfoWindow({
        content: content,
        position: positionBuff
      });
      window.googleInfoWindow?.open(window.googleMap);
    } catch (e: any) {
      this.onError("open info", e);
    }
  }
  async googleSetMarker(markerModel: GoogleSetMarkerModel[]): Promise<void> {
    const map = window.googleMap;
    for (let marker of markerModel) {
      try {
        const markerBuff = new window.google.maps.marker.AdvancedMarkerElement({
          title: marker.title,
          position: marker.position,
          content: marker.icon,
          map,
        });
        markerBuff.addEventListener("click", (): void => {
          this.googleOpenInfoWindow(marker.content, markerBuff.position);
        });

        this.googleMarker.push(markerBuff);
      } catch (e: any) {
        this.onError("marker", e);
      }
    }
  }

  clearMarker(data?: any): void {
    try {
      this.googleMarker.forEach(x => {
        x.setMap(null);
      });
      this.googleMarker = [];
      window.googleInfoWindow?.close();
    } catch (e: any) {
      this.onError("clear marker", e);
    }
  }
  panTo(latitude: number, longitude: number, zoom: number = 15): void {
    window.googlePosition = {lat: latitude, lng: longitude};
    window.googleMap.setCenter(new window.google.maps.LatLng(latitude, longitude));
    window.googleMap.setZoom(zoom);
  }

  themeSelectionChange(data: {label: string, func: () => any}): void {
//    this.selectedTheme = data
//    if (window.googleMap) {
//      window.googleMap.setOptions({ styles: this.selectedTheme.func });
//    }
  }
  getSelectedTheme(position?: number) {
    if (position && position >= 0 && position <= 4) {
      return FGoogleMapStyle.googleThemeList()[position];
    }
    return FGoogleMapStyle.googleThemeList()[0];
  }
}

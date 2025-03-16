import {ChangeDetectorRef, Component, Inject, ViewChild} from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {DOCUMENT, NgIf} from "@angular/common";
import {GoogleMapComponent} from "../../google-map/google-map.component";
import {HospitalTempService} from "../../../../services/rest/hospital-temp.service";
import {FormsModule} from "@angular/forms";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {TranslatePipe} from "@ngx-translate/core";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import * as FGoogleMapStyle from "../../../../guards/f-google-map-style";
import {Listbox} from "primeng/listbox";
import {PrimeTemplate} from "primeng/api";
import {HospitalTempModel} from "../../../../models/rest/hospital/hospital-temp-model";
import {Button} from "primeng/button";
import {GoogleSetMarkerModel} from "../../../../models/common/google-set-marker-model";
import {ProgressSpinner} from "primeng/progressspinner";
import {IconField} from "primeng/iconfield";

@Component({
  selector: "app-hospital-temp-find",
  imports: [GoogleMapComponent, FormsModule, IftaLabel, InputText, TranslatePipe, Listbox, PrimeTemplate, Button, NgIf, ProgressSpinner, IconField],
  templateUrl: "./hospital-temp-find.component.html",
  styleUrl: "./hospital-temp-find.component.scss",
  standalone: true,
})
export class HospitalTempFindComponent extends FDialogComponentBase {
  @ViewChild("googleMap") googleMap!: GoogleMapComponent;
  searchString: string = "";
  latitude: number = FConstants.DEF_LAT;
  longitude: number = FConstants.DEF_LNG;
  mapVisible: boolean = true;
  hospitalItems: HospitalTempModel[] = [];
  selectedHospital?: HospitalTempModel;
  findNearbyAble: boolean = false;
  constructor(@Inject(DOCUMENT) private document: Document, private cd: ChangeDetectorRef, private thisService: HospitalTempService) {
    super();
  }

  override async ngInit(): Promise<void> {
    this.getCurrentPosition();
  }

  getCurrentPosition(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.onSuccessGeolocation.bind(this), this.onErrorGeolocation.bind(this));
    }
  }
  async getSearchHospital(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getListSearch(this.searchString),
      e => this.onError("getSearchHospital", e));
    this.setLoading(false);
    if (ret.result) {
      this.hospitalItems = ret.data ?? [];
      await this.addMarker();
      return;
    }
    this.onWarn("getSearchHospital", ret.msg);
  }
  async getNearbyHospital(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getListNearBy(this.latitude, this.longitude),
      e => this.onError("getNearbyHospital", e));
    this.setLoading(false);
    if (ret.result) {
      this.hospitalItems = ret.data ?? [];
      await this.addMarker();
      return;
    }
    this.onWarn("getNearbyHospital", ret.msg);
  }
  mapToggle(): void {
    this.mapVisible = !this.mapVisible;
  }
  hospitalSelect(): void {
    if (this.selectedHospital == null) {
      return;
    }
    this.ref.close(this.selectedHospital);
  }
  close(): void {
    this.ref.close();
  }

  onError(title: string, msg?: string): void {
    this.fDialogService.error(title, msg);
  }
  onWarn(title: string, msg?: string): void {
    this.fDialogService.error(title, msg);
  }
  tossError(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  tossWarn(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  async searchHospital(event: any): Promise<void> {
    if (this.searchString.length <= 2) {
      this.translateService.get("hospital-temp-find.warn.search-string").subscribe(x => {
        this.fDialogService.warn("search", x);
      });
      return;
    }

    await this.getSearchHospital();
  }
  async onSuccessGeolocation(data: any): Promise<void> {
    this.latitude = data.coords.latitude;
    this.longitude = data.coords.longitude;
    await this.setMapVisible();
    await this.googleMapPan(this.latitude, this.longitude);
    this.findNearbyAble = true;
    await this.getNearbyHospital();
  }
  onErrorGeolocation(): void {
    this.findNearbyAble = false;
  }
  async selectHospitalChange(data?: HospitalTempModel): Promise<void> {
    if (data) {
      await this.openMap(data);
      await this.googleOpenInfoWindow(data);
    }
  }
  get filterFields(): string[] {
    return ["orgName", "address"];
  }

  async addMarker(): Promise<void> {
    await this.googleMapMarkerClear();
    const markerModel: GoogleSetMarkerModel[] = [];
    this.hospitalItems.forEach(x => {
      markerModel.push(FExtensions.applyClass(GoogleSetMarkerModel, obj => {
        obj.title = x.orgName;
        obj.content = FGoogleMapStyle.hospitalContent(x.orgName, x.address, x.phoneNumber, x.websiteUrl);
        obj.position = {lat: x.latitude, lng: x.longitude};
        obj.icon.src = "/assets/icon/hospital_green.svg";
      }));
    });
    await this.googleMapSetMarker(markerModel);
  }
  async openMap(data: HospitalTempModel): Promise<void> {
    await this.setMapVisible();
    await this.googleMapPan(data.latitude, data.longitude);
  }

  async setMapVisible(data: boolean = true): Promise<void> {
    this.mapVisible = data;
    this.cd.detectChanges();
    await FExtensions.awaitDelay(100);
  }
  async googleMapPan(latitude: number, longitude: number, zoom: number = 15): Promise<void> {
    this.cd.detectChanges();
    await FExtensions.awaitDelay(100);
    if (this.googleMap) {
      this.googleMap.panTo(latitude, longitude, zoom);
    }
  }
  async googleMapMarkerClear(): Promise<void> {
    if (this.googleMap) {
      this.googleMap.clearMarker();
    }
  }
  async googleMapSetMarker(markerModel: GoogleSetMarkerModel[]): Promise<void> {
    if (this.googleMap) {
      await this.googleMap.googleSetMarker(markerModel);
    }
  }
  async googleOpenInfoWindow(data: HospitalTempModel): Promise<void> {
    if (this.googleMap) {
      await this.googleMap.googleOpenInfoWindow(FGoogleMapStyle.hospitalContent(data.orgName, data.address, data.phoneNumber, data.websiteUrl), {lat: data.latitude, lng: data.longitude});
    }
  }
}

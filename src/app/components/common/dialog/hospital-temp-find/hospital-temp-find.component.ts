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

@Component({
  selector: "app-hospital-temp-find",
  imports: [GoogleMapComponent, FormsModule, IftaLabel, InputText, TranslatePipe, Listbox, PrimeTemplate, Button, NgIf, ProgressSpinner],
  templateUrl: "./hospital-temp-find.component.html",
  styleUrl: "./hospital-temp-find.component.scss",
  standalone: true,
})
export class HospitalTempFindComponent extends FDialogComponentBase {
  @ViewChild("googleMap") googleMap!: GoogleMapComponent;
  searchString: string = "";
  latitude: number = FConstants.DEF_LAT;
  longitude: number = FConstants.DEF_LNG;
  mapVisible: boolean = false;
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
      this.mapVisible = false;
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
      this.mapVisible = false;
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
        console.log(x);
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
  }
  onErrorGeolocation(): void {
    this.findNearbyAble = false;
  }
  async selectHospitalChange(event?: HospitalTempModel): Promise<void> {
    if (event) {
      await this.openMap(event)
    }
  }
  get filterFields(): string[] {
    return ["orgName", "address"];
  }

  async openMap(data: HospitalTempModel): Promise<void> {
    await this.setMapVisible();
    await this.googleMapPan(data.latitude, data.longitude);
    await this.googleMapMarkerClear();
    const markerModel: GoogleSetMarkerModel[] = [];
    markerModel.push(FExtensions.applyClass(GoogleSetMarkerModel, obj => {
      obj.content = FGoogleMapStyle.hospitalContent(data.orgName, data.address, data.phoneNumber, data.websiteUrl);
      obj.position = {lat: data.latitude, lng: data.longitude};
    }));
    await this.googleMap.googleSetMarker(markerModel);
  }

  async setMapVisible(data: boolean = true): Promise<void> {
    this.mapVisible = data;
    this.cd.detectChanges();
    await FExtensions.awaitDelay(100);
  }
  async googleMapPan(latitude: number, longitude: number): Promise<void> {
    this.cd.detectChanges();
    await FExtensions.awaitDelay(100);
    if (this.googleMap) {
      this.googleMap.panTo(latitude, longitude);
    }
  }
  async googleMapMarkerClear(): Promise<void> {
    if (this.googleMap) {
      this.googleMap.clearMarker();
    }
  }
}

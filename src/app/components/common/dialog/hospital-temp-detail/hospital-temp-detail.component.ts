import {ChangeDetectorRef, Component, Inject, ViewChild} from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {GoogleMapComponent} from "../../google-map/google-map.component";
import {DOCUMENT, NgIf} from "@angular/common";
import {HospitalTempService} from "../../../../services/rest/hospital-temp.service";
import {HospitalTempModel} from "../../../../models/rest/hospital/hospital-temp-model";
import {GoogleSetMarkerModel} from "../../../../models/common/google-set-marker-model";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FGoogleMapStyle from "../../../../guards/f-google-map-style";
import {ProgressSpinner} from "primeng/progressspinner";
import {Button} from "primeng/button";
import {PharmacyTempModel} from "../../../../models/rest/hospital/pharmacy-temp-model";
import {FormsModule} from "@angular/forms";
import {Listbox} from "primeng/listbox";
import {PrimeTemplate} from "primeng/api";
import {TranslatePipe} from "@ngx-translate/core";
import {IconField} from "primeng/iconfield";

@Component({
  selector: "app-hospital-temp-detail",
  imports: [NgIf, ProgressSpinner, Button, GoogleMapComponent, FormsModule, Listbox, PrimeTemplate, TranslatePipe, IconField],
  templateUrl: "./hospital-temp-detail.component.html",
  styleUrl: "./hospital-temp-detail.component.scss",
  standalone: true
})
export class HospitalTempDetailComponent extends FDialogComponentBase {
  @ViewChild("googleMap") googleMap!: GoogleMapComponent;
  tempHospitalPK: string = "";
  hospitalItem?: HospitalTempModel;
  pharmacyItems: PharmacyTempModel[] = [];
  selectedPharmacy?: PharmacyTempModel;
  pharmacyOn: boolean = true;
  mapVisible: boolean = true;
  constructor(@Inject(DOCUMENT) private document: Document, private cd: ChangeDetectorRef, private thisService: HospitalTempService) {
    super();
    const dlg = this.dialogService.getInstance(this.ref);
    this.tempHospitalPK = dlg.data;
  }

  override async ngInit(): Promise<void> {
    await this.getData();
  }

  async getData(): Promise<void> {
    if (this.tempHospitalPK.length <= 0) {
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.tempHospitalPK),
      e => this.fDialogService.error("getData", e));
    if (ret.result) {
      this.hospitalItem = ret.data;
      await this.openMap();
      await this.getNearbyPharmacyData();
      return;
    }
    this.fDialogService.warn("getData", ret.msg);
  }
  async getNearbyPharmacyData(): Promise<void> {
    const hospital = this.hospitalItem;
    if (hospital == undefined) {
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.getPharmacyListNearBy(hospital.latitude, hospital.longitude),
      e => this.fDialogService.error("getNearbyPharmacyData", e));
    if (ret.result) {
      this.pharmacyItems = ret.data ?? [];
      await this.addPharmacyMarker();
      return;
    }
    this.fDialogService.warn("getNearbyPharmacyData", ret.msg);
  }

  tossError(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  tossWarn(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  mapToggle(): void {
    this.mapVisible = !this.mapVisible;
  }
  close(): void {
    this.ref.close();
  }
  async openMap(): Promise<void> {
    const hospital = this.hospitalItem;
    if (hospital) {
      await this.googleMapPan(hospital.latitude, hospital.longitude);
      await this.googleMapMarkerClear();
      const markerModel: GoogleSetMarkerModel[] = [];
      markerModel.push(FExtensions.applyClass(GoogleSetMarkerModel, obj => {
        obj.title = hospital.orgName;
        obj.content = FGoogleMapStyle.hospitalContent(hospital.orgName, hospital.address, hospital.phoneNumber, hospital.websiteUrl);
        obj.position = {lat: hospital.latitude, lng: hospital.longitude};
        obj.icon.src = "/assets/icon/hospital_green.svg";
      }));
      await this.googleMapSetMarker(markerModel);
    }
  }
  async setHospitalMarker(): Promise<void> {
    const hospital = this.hospitalItem;
    if (hospital) {
      await this.googleMapMarkerClear();
      const markerModel: GoogleSetMarkerModel[] = [];
      markerModel.push(FExtensions.applyClass(GoogleSetMarkerModel, obj => {
        obj.title = hospital.orgName;
        obj.content = FGoogleMapStyle.hospitalContent(hospital.orgName, hospital.address, hospital.phoneNumber, hospital.websiteUrl);
        obj.position = {lat: hospital.latitude, lng: hospital.longitude};
        obj.icon.src = "/assets/icon/hospital_green.svg";
      }));
      await this.googleMapSetMarker(markerModel);
    }
  }
  async addPharmacyMarker(): Promise<void> {
    if (!this.pharmacyOn) {
      return;
    }
    const markerModel: GoogleSetMarkerModel[] = [];
    this.pharmacyItems.forEach(x => {
      markerModel.push(FExtensions.applyClass(GoogleSetMarkerModel, obj => {
        obj.title = x.orgName;
        obj.content = FGoogleMapStyle.pharmacyContent(x.orgName, x.address, x.phoneNumber);
        obj.position = {lat: x.latitude, lng: x.longitude};
        obj.icon.src = "/assets/icon/pharmacy_red.svg";
      }));
    });
    await this.googleMapSetMarker(markerModel);
  }

  async pharmacyToggle(): Promise<void> {
    this.pharmacyOn = !this.pharmacyOn;
    await this.setHospitalMarker();
    await this.addPharmacyMarker();
  }
  async selectPharmacyChange(data?: PharmacyTempModel): Promise<void> {
    if (data) {
      await this.googleMapPan(data.latitude, data.longitude);
      await this.googleOpenInfoWindow(data);
    }
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
  async googleOpenInfoWindow(data: PharmacyTempModel): Promise<void> {
    if (this.googleMap) {
      await this.googleMap.googleOpenInfoWindow(FGoogleMapStyle.pharmacyContent(data.orgName, data.address, data.phoneNumber), {lat: data.latitude, lng: data.longitude});
    }
  }
  get filterFields(): string[] {
    return ["orgName", "address"];
  }
}

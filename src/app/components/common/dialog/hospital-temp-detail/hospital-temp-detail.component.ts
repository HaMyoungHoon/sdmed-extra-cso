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

@Component({
  selector: "app-hospital-temp-detail",
  imports: [NgIf, ProgressSpinner, Button, GoogleMapComponent],
  templateUrl: "./hospital-temp-detail.component.html",
  styleUrl: "./hospital-temp-detail.component.scss",
  standalone: true
})
export class HospitalTempDetailComponent extends FDialogComponentBase {
  @ViewChild("googleMap") googleMap!: GoogleMapComponent;
  tempHospitalPK: string = "";
  hospitalItem?: HospitalTempModel;
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
      return;
    }
    this.fDialogService.warn("getData", ret.msg);
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
      await this.setMapVisible();
      await this.googleMapPan(hospital.latitude, hospital.longitude);
      await this.googleMapMarkerClear();
      const markerModel: GoogleSetMarkerModel[] = [];
      markerModel.push(FExtensions.applyClass(GoogleSetMarkerModel, obj => {
        obj.content = FGoogleMapStyle.hospitalContent(hospital.orgName, hospital.address, hospital.phoneNumber, hospital.websiteUrl);
        obj.position = {lat: hospital.latitude, lng: hospital.longitude};
      }));
      await this.googleMap.googleSetMarker(markerModel);
    }
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

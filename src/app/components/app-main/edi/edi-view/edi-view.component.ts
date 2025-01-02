import {Component, input} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {EDIUploadFileModel} from "../../../../models/rest/edi/edi-upload-file-model";
import {saveAs} from "file-saver";
import {EDIUploadPharmaModel} from "../../../../models/rest/edi/edi-upload-pharma-model";
import {transformToBoolean} from "primeng/utils";
import {stringToEDIState, StringToEDIStateDesc} from "../../../../models/rest/edi/edi-state";
import {EDIUploadPharmaMedicineModel} from "../../../../models/rest/edi/edi-upload-pharma-medicine-model";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-edi-view",
  templateUrl: "./edi-view.component.html",
  styleUrl: "./edi-view.component.scss",
  standalone: false,
})
export class EdiViewComponent extends FComponentBase {
  thisPK: string = "";
  uploadModel: EDIUploadModel = new EDIUploadModel();
  constructor(private thisService: EdiListService, private route: ActivatedRoute) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
    this.thisPK = this.route.snapshot.params["thisPK"];
  }

  override async ngInit(): Promise<void> {
    await this.getData();
  }

  async getData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.thisPK),
      e => this.fDialogService.error("getData", e));
    this.setLoading(false);
    if (ret.result) {
      this.uploadModel = ret.data ?? new EDIUploadModel();
      return;
    }
    this.fDialogService.warn("getData", ret.msg);
  }

  getApplyDate(): string {
    return `${this.uploadModel.year}-${this.uploadModel.month}`;
  }
  getPharmaApplyDate(pharma: EDIUploadPharmaModel): string {
    return FExtensions.dateToYYYYMMdd(FExtensions.stringToDate(`${pharma.year}-${pharma.month}-${pharma.day}`));
  }
  getMedicineTotalPrice(medicine: EDIUploadPharmaMedicineModel): string {
    return FExtensions.numberWithCommas(`${medicine.count * medicine.price * medicine.charge / 100}`);
  }
  getMedicineApplyDate(medicine: EDIUploadPharmaMedicineModel): string {
    return FExtensions.dateToYYYYMMdd(FExtensions.stringToDate(`${medicine.year}-${medicine.month}-${medicine.day}`));
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionIndex(item: EDIUploadPharmaModel): string {
    return `${this.uploadModel.pharmaList.findIndex(x => x.thisPK == item.thisPK)}`;
  }

  getBlobUrl(item: EDIUploadFileModel): string {
    const ext = FExtensions.getExtMimeType(item.mimeType);
    if (FExtensions.isImage(ext)) {
      return item.blobUrl;
    }
    return FExtensions.extToBlobUrl(ext);
  }
  async downloadEDIFile(item: EDIUploadFileModel): Promise<void> {
    const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
      e => this.fDialogService.error("downloadFile", e));
    if (ret && ret.body) {
      saveAs(ret.body, item.originalFilename);
    }
  }

  get downloadFileTooltip(): string {
    return "common-desc.save";
  }

  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
  protected readonly stringToEDIState = stringToEDIState;
  protected readonly StringToEDIStateDesc = StringToEDIStateDesc;
}

import {ChangeDetectorRef, Component, input, QueryList, ViewChildren} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FImageCache from "../../../../guards/f-image-cache";
import {saveAs} from "file-saver";
import {transformToBoolean} from "primeng/utils";
import {StringToEDIStateDesc} from "../../../../models/rest/edi/edi-state";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {ActivatedRoute} from "@angular/router";
import {Subject, takeUntil} from "rxjs";
import {EDIType} from "../../../../models/rest/edi/edi-type";
import {EDIUploadPharmaFileModel} from "../../../../models/rest/edi/edi-upload-pharma-file-model";
import {EdiPharmaFileViewModelComponent} from "../../../common/edi-pharma-file-view-model/edi-pharma-file-view-model.component";
import {ExtraEDIDetailResponse} from "../../../../models/rest/edi/extra-edi-detail-response";
import {ExtraEDIPharma} from "../../../../models/rest/edi/extra-edi-pharma";
import {ExtraEDIResponse} from "../../../../models/rest/edi/extra-edi-response";

@Component({
  selector: "app-edi-view",
  templateUrl: "./edi-view.component.html",
  styleUrl: "./edi-view.component.scss",
  standalone: false,
})
export class EdiViewComponent extends FComponentBase {
  @ViewChildren("ediPharmaFileViewModel") ediPharmaFileViewModel!: QueryList<EdiPharmaFileViewModelComponent>;
  thisPK: string = "";
  uploadModel: ExtraEDIDetailResponse = new ExtraEDIDetailResponse();
  constructor(private thisService: EdiListService, private route: ActivatedRoute, private cd: ChangeDetectorRef) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
    this.thisPK = this.route.snapshot.params["thisPK"];
  }

  override async ngInit(): Promise<void> {
    this.subscribeRouter();
  }
  override async ngDestroy(): Promise<void> {
  }
  subscribeRouter(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.route.params.pipe(takeUntil(sub)).subscribe(async(x) => {
      this.thisPK = x["thisPK"];
      await this.getData();
    });
  }

  onError(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  onWarn(data: {title: string, msg?: string}): void {
    this.fDialogService.warn(data.title, data.msg);
  }
  async getData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.thisPK),
      e => this.fDialogService.error("getData", e));
    if (ret.result) {
      this.uploadModel = ret.data ?? new EDIUploadModel();
      this.uploadModel.pharmaList.forEach(x => {
        if (x.fileList == undefined) {
          x.fileList = [];
        }
      });
      this.cd.detectChanges();
      await this.readyImage();
      this.setLoading(false);
      return;
    }
    this.setLoading(false);
    this.fDialogService.warn("getData", ret.msg);
  }
  async readyImage(): Promise<void> {
    for (let fileView of this.ediPharmaFileViewModel) {
      await fileView.readyImage();
    }
  }

  getApplyDate(): string {
    return `${this.uploadModel.year}-${this.uploadModel.month}`;
  }
  getPharmaApplyDate(pharma: ExtraEDIPharma): string {
    return `${pharma.year}-${pharma.month}`;
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionPharmaIndex(item: ExtraEDIPharma): string {
    return `${this.uploadModel.pharmaList.findIndex(x => x.thisPK == item.thisPK)}`;
  }
  accordionResponseIndex(item: ExtraEDIResponse): string {
    return `${this.uploadModel.responseList.findIndex(x => x.thisPK == item.thisPK)}`;
  }
  async viewPharmaItem(data: {list: EDIUploadPharmaFileModel[], item: EDIUploadPharmaFileModel}): Promise<void> {
    this.fDialogService.openFullscreenFileView({
      closable: false,
      closeOnEscape: true,
      maximizable: true,
      width: "100%",
      height: "100%",
      data: {
        file: FExtensions.ediPharmaFileListToViewModel(data.list),
        index: data.list.findIndex(x => x.thisPK == data.item.thisPK)
      }
    });
  }
  openHospitalTempDetail(): void {
    this.fDialogService.openHospitalTempDetailView({
      closable: false,
      closeOnEscape: true,
      maximizable: true,
      width: "85%",
      modal: true,
      data: this.uploadModel.tempHospitalPK
    });
  }
  async mqttSend(thisPK: string | undefined, content: string | undefined): Promise<void> {
    if (thisPK == undefined || content == undefined) {
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.mqttService.postEDIFileAdd(thisPK, content));
//      e => this.fDialogService.warn("notice", e));
//    if (ret.result) {
//      return;
//    }
//    this.fDialogService.warn("notice", ret.msg);
  }
  async downloadEDIPharmaFile(item: EDIUploadPharmaFileModel): Promise<void> {
    let blobBuff = await FImageCache.getImage(item.blobUrl);
    if (blobBuff == undefined) {
      const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
        e => this.fDialogService.error("downloadFile", e));
      if (ret && ret.body) {
        blobBuff = ret.body;
        await FImageCache.putImage(item.blobUrl, blobBuff);
      }
    }
    if (blobBuff) {
      saveAs(blobBuff, item.originalFilename);
    }
  }
  changeFile(pharma: ExtraEDIPharma): void {
    const target = this.uploadModel.pharmaList.find(x => x.thisPK == pharma.thisPK);
    target?.init(pharma);
  }
  async removeEDIPharmaFile(data: {event: Event, item: EDIUploadPharmaFileModel}): Promise<void> {
    this.translateService.get(["common-desc.delete-sure", "common-desc.cancel", "common-desc.confirm"]).subscribe(x => {
      this.confirmCall(data.event, x["common-desc.remove"], x["common-desc.delete-sure"], x["common-desc.cancel"], x["common-desc.confirm"], async() => {
        this.setLoading();
        const ret = await FExtensions.restTry(async() => await this.thisService.deleteEDIPharmaFile(data.item.thisPK),
          e => this.fDialogService.error("delete", e));
        this.setLoading(false);
        if (ret.result) {
        }
        this.fDialogService.warn("delete", ret.msg);
      });
    });
  }

  async uploadAdditionalFile(pharma: ExtraEDIPharma): Promise<void> {
    if (pharma.uploadFileBuffModel == undefined || pharma.uploadFileBuffModel.length <= 0) {
      return;
    }
    this.setLoading();
    const fileList: EDIUploadPharmaFileModel[] = [];
    const azureUploadRet = await this.uploadAzure(pharma, fileList);
    if (!azureUploadRet) {
      this.setLoading(false);
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.postPharmaFile(this.thisPK, pharma.thisPK, fileList),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      await this.mqttSend(this.thisPK, this.uploadModel.orgName);
      pharma.uploadFileBuffModel.forEach(x => x.revokeBlob());
      window.location.reload();
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }
  async uploadAzure(pharma: ExtraEDIPharma, fileList: EDIUploadPharmaFileModel[]): Promise<boolean> {
    let ret = true;
    for (const buff of pharma.uploadFileBuffModel) {
      const blobName = FExtensions.getEDIUploadBlobName(buff.ext);
      const blobStorageInfo = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(blobName),
        e => this.fDialogService.error("saveData", e));
      if (!blobStorageInfo.result) {
        this.fDialogService.warn("saveData", blobStorageInfo.msg);
        ret = false;
        break;
      }
      const uploadFile = FExtensions.getEDIUploadPharmaFileModel(buff.file!!, blobStorageInfo.data!!, buff.ext, buff.mimeType);
      await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(buff.file!!, blobStorageInfo.data, uploadFile.blobName, uploadFile.mimeType),
        e => {
          this.fDialogService.error("saveData", e);
          ret = false;
        });
      if (!ret) {
        break;
      }
      fileList.push(uploadFile);
    }

    return ret;
  }

  get isTransfer(): boolean {
    return this.uploadModel.ediType == EDIType.TRANSFER;
  }
  get isNew(): boolean {
    return this.uploadModel.ediType == EDIType.NEW;
  }
  get isDefault(): boolean {
    return this.uploadModel.ediType == EDIType.DEFAULT;
  }
  get hospitalTempDetailAble(): boolean {
    return this.uploadModel.tempHospitalPK.length > 0;
  }

  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly StringToEDIStateDesc = StringToEDIStateDesc;
}

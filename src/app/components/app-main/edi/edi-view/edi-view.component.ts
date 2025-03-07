import {Component, ElementRef, input, QueryList, ViewChild, ViewChildren} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import * as FImageCache from "../../../../guards/f-image-cache";
import {EDIUploadFileModel} from "../../../../models/rest/edi/edi-upload-file-model";
import {saveAs} from "file-saver";
import {EDIUploadPharmaModel} from "../../../../models/rest/edi/edi-upload-pharma-model";
import {transformToBoolean} from "primeng/utils";
import {EDIState, StringToEDIStateDesc} from "../../../../models/rest/edi/edi-state";
import {EDIUploadPharmaMedicineModel} from "../../../../models/rest/edi/edi-upload-pharma-medicine-model";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {ActivatedRoute} from "@angular/router";
import {EDIUploadResponseModel} from "../../../../models/rest/edi/edi-upload-response-model";
import {Subject, takeUntil} from "rxjs";
import {EDIType} from "../../../../models/rest/edi/edi-type";
import {EDIUploadPharmaFileModel} from "../../../../models/rest/edi/edi-upload-pharma-file-model";

@Component({
  selector: "app-edi-view",
  templateUrl: "./edi-view.component.html",
  styleUrl: "./edi-view.component.scss",
  standalone: false,
})
export class EdiViewComponent extends FComponentBase {
  @ViewChildren("inputFiles") inputFiles!: QueryList<ElementRef>;
  thisPK: string = "";
  uploadModel: EDIUploadModel = new EDIUploadModel();
  pharmaFileActiveIndex: number[] = [];
  pharmaUploadActiveIndex: number[] = [];
  activeIndex: number = 0;
  imageCacheUrl: {blobUrl: string, objectUrl: string}[] = [];
  constructor(private thisService: EdiListService, private route: ActivatedRoute) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
    this.thisPK = this.route.snapshot.params["thisPK"];
  }

  override async ngInit(): Promise<void> {
    this.subscribeRouter();
  }
  override async ngDestroy(): Promise<void> {
    this.imageCacheClear();
  }
  subscribeRouter(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.route.params.pipe(takeUntil(sub)).subscribe(async(x) => {
      this.thisPK = x["thisPK"];
      await this.getData();
    });
  }

  async getData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(this.thisPK),
      e => this.fDialogService.error("getData", e));
    if (ret.result) {
      this.uploadModel = ret.data ?? new EDIUploadModel();
      this.uploadModel.pharmaList.forEach(x => {
        this.pharmaFileActiveIndex.push(0);
        this.pharmaUploadActiveIndex.push(0);
      });
      await this.readyImage();
      this.setLoading(false);
      return;
    }
    this.setLoading(false);
    this.fDialogService.warn("getData", ret.msg);
  }
  imageCacheClear(): void {
    this.imageCacheUrl.forEach(x => {
      URL.revokeObjectURL(x.objectUrl);
    });
    this.imageCacheUrl = [];
  }
  async readyImage(): Promise<void> {
    this.imageCacheClear();
    for (let ediFile of this.uploadModel.fileList) {
      const ext = FExtensions.getExtMimeType(ediFile.mimeType);
      if (!FExtensions.isImage(ext)) {
        this.imageCacheUrl.push({
          blobUrl: ediFile.blobUrl,
          objectUrl: FExtensions.extToBlobUrl(ext)
        });
      } else {
        this.imageCacheUrl.push({
          blobUrl: ediFile.blobUrl,
          objectUrl: ediFile.blobUrl,
        });
      }
    }
  }

  getApplyDate(): string {
    return `${this.uploadModel.year}-${this.uploadModel.month}`;
  }
  getPharmaApplyDate(pharma: EDIUploadPharmaModel): string {
    return `${pharma.year}-${pharma.month}`;
  }
  getMedicineTotalPrice(medicine: EDIUploadPharmaMedicineModel): string {
    return FExtensions.numberWithCommas(`${medicine.count * medicine.price * medicine.charge / 100}`);
  }
  getMedicineApplyDate(medicine: EDIUploadPharmaMedicineModel): string {
    return FExtensions.dateToYYYYMMdd(FExtensions.stringToDate(`${medicine.year}-${medicine.month}-${medicine.day}`));
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionPharmaIndex(item: EDIUploadPharmaModel): string {
    return `${this.uploadModel.pharmaList.findIndex(x => x.thisPK == item.thisPK)}`;
  }
  accordionResponseIndex(item: EDIUploadResponseModel): string {
    return `${this.uploadModel.responseList.findIndex(x => x.thisPK == item.thisPK)}`;
  }

  getBlobUrl(item: EDIUploadFileModel): string {
    return this.imageCacheUrl.find(x => x.blobUrl == item.blobUrl)?.objectUrl ?? FConstants.ASSETS_NO_IMAGE;
  }
  async viewPharmaItem(data: EDIUploadPharmaFileModel[], item: EDIUploadPharmaFileModel): Promise<void> {
    this.fDialogService.openFullscreenFileView({
      closable: false,
      closeOnEscape: true,
      maximizable: true,
      width: "100%",
      height: "100%",
      data: {
        file: FExtensions.ediPharmaFileListToViewModel(data),
        index: data.findIndex(x => x.thisPK == item.thisPK)
      }
    });
  }
  async viewItem(data: EDIUploadFileModel[], item: EDIUploadFileModel): Promise<void> {
    this.fDialogService.openFullscreenFileView({
      closable: false,
      closeOnEscape: true,
      maximizable: true,
      width: "100%",
      height: "100%",
      data: {
        file: FExtensions.ediFileListToViewModel(data),
        index: data.findIndex(x => x.thisPK == item.thisPK)
      }
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
  async downloadEDIFile(item: EDIUploadFileModel): Promise<void> {
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
  async fileUpload(index: number): Promise<void> {
    this.inputFiles.get(index)?.nativeElement?.click();
  }
  async fileSelected(data: Event, index: number): Promise<void> {
    const pharma = this.uploadModel.pharmaList[index];
    const input = data.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const gatheringFile = (await FExtensions.gatheringAbleFile(input.files, (file: File): void => {
        this.translateService.get("common-desc.not-supported-file").subscribe(x => {
          this.fDialogService.warn("fileUpload", `${file.name} ${x}`);
        });
      })).filter(x => !!x.file);
      if (gatheringFile.length > 0) {
        if (pharma.uploadFileBuffModel == undefined) {
          pharma.uploadFileBuffModel = [];
        }
        pharma.uploadFileBuffModel = pharma.uploadFileBuffModel.concat(gatheringFile);
        pharma.uploadFileBuffModel = FExtensions.distinctByFields(pharma.uploadFileBuffModel, ["file.name", "file.size"]);
      }
      const inputBuff = this.inputFiles.get(index);
      if (inputBuff) {
        inputBuff.nativeElement.value = "";
      }


      this.setLoading(false);
    }
  }
  async removeEDIFile(event: Event, item: EDIUploadFileModel): Promise<void> {
    this.translateService.get(["common-desc.delete-sure", "common-desc.cancel", "common-desc.confirm"]).subscribe(x => {
      this.confirmCall(event, x["common-desc.remove"], x["common-desc.delete-sure"], x["common-desc.cancel"], x["common-desc.confirm"], async() => {
        this.setLoading();
        const ret = await FExtensions.restTry(async() => await this.thisService.deleteEDIFile(item.thisPK),
          e => this.fDialogService.error("delete", e));
        this.setLoading(false);
        if (ret.result) {
          const index = this.uploadModel.fileList.indexOf(item);
          if (index == this.uploadModel.fileList.length - 1) {
            if (this.uploadModel.fileList.length - 1 > 0) {
              this.activeIndex = this.uploadModel.fileList.length - 2;
            } else {
              this.activeIndex = 0;
            }
          }
          if (index >= 0) {
            this.uploadModel.fileList = [...this.uploadModel.fileList.filter(x => x.thisPK != item.thisPK)];
          }
          return;
        }
        this.fDialogService.warn("delete", ret.msg);
      });
    });
  }
  async removeEDIPharmaFile(event: Event, pharma: EDIUploadPharmaModel, index: number): Promise<void> {
    const item = pharma.fileList[index];
    this.translateService.get(["common-desc.delete-sure", "common-desc.cancel", "common-desc.confirm"]).subscribe(x => {
      this.confirmCall(event, x["common-desc.remove"], x["common-desc.delete-sure"], x["common-desc.cancel"], x["common-desc.confirm"], async() => {
        this.setLoading();
        const ret = await FExtensions.restTry(async() => await this.thisService.deleteEDIPharmaFile(item.thisPK),
          e => this.fDialogService.error("delete", e));
        this.setLoading(false);
        if (ret.result) {
          const index = pharma.fileList.indexOf(item);
          if (index == pharma.fileList.length - 1) {
            if (pharma.fileList.length - 1 > 0) {
              this.activeIndex = pharma.fileList.length - 2;
            } else {
              this.activeIndex = 0;
            }
          }
          if (index >= 0) {
            pharma.fileList = [...pharma.fileList.filter(x => x.thisPK != item.thisPK)];
          }
          return;
        }
        this.fDialogService.warn("delete", ret.msg);
      });
    });
  }

  get acceptFiles(): string {
    return ".jpg,.jpeg,.png,.webp,.bmp,.xlsx,.pdf,.heif,.heic,.gif";
  }
  async uploadAdditionalFile(pharma: EDIUploadPharmaModel): Promise<void> {
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
  async uploadAzure(pharma: EDIUploadPharmaModel, fileList: EDIUploadPharmaFileModel[]): Promise<boolean> {
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
  deleteUploadFile(pharma: EDIUploadPharmaModel, index: number): void {
    if (pharma.uploadFileBuffModel == undefined) {
      return;
    }
    const data = pharma.uploadFileBuffModel[index];
    if (index == pharma.uploadFileBuffModel.length - 1) {
      if (pharma.uploadFileBuffModel.length - 1 > 0) {
        this.pharmaUploadActiveIndex[index] = pharma.uploadFileBuffModel.length - 2;
      } else {
        this.pharmaUploadActiveIndex[index] = 0;
      }
    }

    if (index >= 0) {
      data.revokeBlob();
      pharma.uploadFileBuffModel.splice(index, 1);
    }
  }

  get downloadFileTooltip(): string {
    return "common-desc.save";
  }
  get removeFileTooltip(): string {
    return "common-desc.remove";
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
  uploadAble(pharma: EDIUploadPharmaModel): boolean {
    if (this.thisPK.length <= 0) return false;
    return pharma.ediState != EDIState.OK && pharma.ediState != EDIState.Reject
  }
  saveAble(pharma: EDIUploadPharmaModel): boolean {
    if (pharma.uploadFileBuffModel) {
      return pharma.uploadFileBuffModel.length > 0;
    }
    return false;
  }

  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
  protected readonly galleriaContainerStyleWithThumbnail = FConstants.galleriaContainerStyleWithThumbnail;
  protected readonly StringToEDIStateDesc = StringToEDIStateDesc;
}

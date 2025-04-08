import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {Button} from "primeng/button";
import {ConfirmPopup} from "primeng/confirmpopup";
import {GalleriaModule} from "primeng/galleria";
import {NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import * as FConstants from "../../../guards/f-constants";
import * as FExtensions from "../../../guards/f-extensions";
import {EDIState} from "../../../models/rest/edi/edi-state";
import {EDIUploadPharmaFileModel} from "../../../models/rest/edi/edi-upload-pharma-file-model";
import {ProgressSpinner} from "primeng/progressspinner";
import {ExtraEDIPharma} from "../../../models/rest/edi/extra-edi-pharma";

@Component({
  selector: "app-edi-pharma-file-view-model",
  imports: [Button, ConfirmPopup, GalleriaModule, NgIf, PrimeTemplate, Tooltip, TranslatePipe, ProgressSpinner],
  templateUrl: "./edi-pharma-file-view-model.component.html",
  styleUrl: "./edi-pharma-file-view-model.component.scss",
  standalone: true,
})
export class EdiPharmaFileViewModelComponent {
  @ViewChild("inputFiles") inputFiles!: ElementRef<HTMLInputElement>;
  @Input() pharmaModel: ExtraEDIPharma = new ExtraEDIPharma();
  @Output() downloadPharmaItemEvent: EventEmitter<EDIUploadPharmaFileModel> = new EventEmitter();
  @Output() removeEDIPharmaItemEvent: EventEmitter<{event: Event, item: EDIUploadPharmaFileModel}> = new EventEmitter();
  @Output() viewPharmaItemEvent: EventEmitter<{list: EDIUploadPharmaFileModel[], item: EDIUploadPharmaFileModel}> = new EventEmitter();
  @Output() error: EventEmitter<{title: string, msg?: string}> = new EventEmitter();
  @Output() warn: EventEmitter<{title: string, msg?: string}> = new EventEmitter();
  @Output() changeFile: EventEmitter<ExtraEDIPharma> = new EventEmitter();
  @Output() uploadAdditionalFileEvent: EventEmitter<ExtraEDIPharma> = new EventEmitter();
  activeIndex: number = 0;
  uploadActiveIndex: number = 0;
  imageCacheUrl: {blobUrl: string, objectUrl: string}[] = [];
  isDragging: boolean = false;
  isLoading: boolean = false;
  constructor(private translateService: TranslateService) {
  }

  onError(title: string, msg?: string): void {
    this.error.next({title: title, msg: msg});
  }
  onWarn(title: string, msg?: string): void {
    this.warn.next({title: title, msg: msg});
  }
  onChangeFile(): void {
    this.changeFile.next(this.pharmaModel);
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.uploadAble()) {
      return;
    }
    this.isDragging = true;
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    if (!this.uploadAble()) {
      return;
    }
    this.isDragging = false;
  }
  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    if (!this.uploadAble()) {
      return;
    }
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      this.setLoading();
      const gatheringFile = (await FExtensions.gatheringAbleFile(event.dataTransfer.files, (file: File): void => {
        this.translateService.get("common-desc.not-supported-file").subscribe(x => {
          this.onWarn("fileUpload", `${file.name} ${x}`);
        });
      })).filter(x => !!x.file);
      if (gatheringFile.length > 0) {
        if (this.pharmaModel.uploadFileBuffModel == undefined) {
          this.pharmaModel.uploadFileBuffModel = [];
        }
        this.pharmaModel.uploadFileBuffModel = this.pharmaModel.uploadFileBuffModel.concat(gatheringFile);
        this.pharmaModel.uploadFileBuffModel = FExtensions.distinctByFields(this.pharmaModel.uploadFileBuffModel, ["file.name", "file.size"]);
      }
      this.inputFiles.nativeElement.value = "";
      this.onChangeFile();
      this.setLoading(false);
    }
  }
  setLoading(data: boolean = true): void {
    this.isLoading = data;
  }
  imageCacheClear(): void {
    this.imageCacheUrl.forEach(x => {
      URL.revokeObjectURL(x.objectUrl);
    });
    this.imageCacheUrl = [];
  }
  async readyImage(): Promise<void> {
    this.imageCacheClear();
    for (let ediFile of this.pharmaModel.fileList) {
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
  async downloadEDIPharmaFile(item: EDIUploadPharmaFileModel): Promise<void> {
    this.downloadPharmaItemEvent.next(item);
  }
  async removeEDIPharmaFile(event: Event): Promise<void> {
    const item = this.pharmaModel.fileList[this.activeIndex];
    this.removeEDIPharmaItemEvent.next({event: event, item: item});
    const index = this.pharmaModel.fileList.indexOf(item);
    if (index == this.pharmaModel.fileList.length - 1) {
      if (this.pharmaModel.fileList.length - 1 > 0) {
        this.activeIndex = this.pharmaModel.fileList.length - 2;
      } else {
        this.activeIndex = 0;
      }
    }
    if (index >= 0) {
      this.pharmaModel.fileList = [...this.pharmaModel.fileList.filter(x => x.thisPK != item.thisPK)];
    }
  }
  async viewPharmaItem(item: EDIUploadPharmaFileModel): Promise<void> {
    const data = this.pharmaModel.fileList;
    this.viewPharmaItemEvent.next({list: data, item: item});
  }
  deleteUploadFile(): void {
    if (this.pharmaModel.uploadFileBuffModel == undefined) {
      return;
    }
    const data = this.pharmaModel.uploadFileBuffModel[this.activeIndex];
    if (this.activeIndex == this.pharmaModel.uploadFileBuffModel.length - 1) {
      if (this.pharmaModel.uploadFileBuffModel.length - 1 > 0) {
        this.uploadActiveIndex = this.pharmaModel.uploadFileBuffModel.length - 2;
      } else {
        this.uploadActiveIndex = 0;
      }
    }

    if (this.activeIndex >= 0) {
      data.revokeBlob();
      this.pharmaModel.uploadFileBuffModel.splice(this.activeIndex, 1);
    }
  }
  async fileUpload(): Promise<void> {
    this.inputFiles.nativeElement.click();
  }
  async fileSelected(data: Event): Promise<void> {
    const input = data.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const gatheringFile = (await FExtensions.gatheringAbleFile(input.files, (file: File): void => {
        this.translateService.get("common-desc.not-supported-file").subscribe(x => {
          this.onWarn("fileUpload", `${file.name} ${x}`);
        });
      })).filter(x => !!x.file);
      if (gatheringFile.length > 0) {
        if (this.pharmaModel.uploadFileBuffModel == undefined) {
          this.pharmaModel.uploadFileBuffModel = [];
        }
        this.pharmaModel.uploadFileBuffModel = this.pharmaModel.uploadFileBuffModel.concat(gatheringFile);
        this.pharmaModel.uploadFileBuffModel = FExtensions.distinctByFields(this.pharmaModel.uploadFileBuffModel, ["file.name", "file.size"]);
      }
      this.inputFiles.nativeElement.value = "";
      this.onChangeFile();
      this.setLoading(false);
    }
  }
  async uploadAdditionalFile(): Promise<void> {
    if (this.pharmaModel.uploadFileBuffModel == undefined || this.pharmaModel.uploadFileBuffModel.length <= 0) {
      return;
    }
    this.uploadAdditionalFileEvent.next(this.pharmaModel);
  }
  getBlobUrl(item: EDIUploadPharmaFileModel): string {
    return this.imageCacheUrl.find(x => x.blobUrl == item.blobUrl)?.objectUrl ?? FConstants.ASSETS_NO_IMAGE;
  }
  get acceptFiles(): string {
    return ".jpg,.jpeg,.png,.webp,.bmp,.xlsx,.pdf,.heif,.heic,.gif";
  }
  get downloadFileTooltip(): string {
    return "common-desc.save";
  }
  get removeFileTooltip(): string {
    return "common-desc.remove";
  }
  uploadAble(): boolean {
    return this.pharmaModel.ediState != EDIState.OK && this.pharmaModel.ediState != EDIState.Reject
  }
  saveAble(): boolean {
    if (this.pharmaModel.uploadFileBuffModel) {
      return this.pharmaModel.uploadFileBuffModel.length > 0;
    }
    return false;
  }

  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
  protected readonly galleriaContainerStyleWithThumbnail = FConstants.galleriaContainerStyleWithThumbnail;
}

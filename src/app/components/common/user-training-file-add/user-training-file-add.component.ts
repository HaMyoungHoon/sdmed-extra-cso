import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import * as FExtensions from "../../../guards/f-extensions";
import * as FConstants from "../../../guards/f-constants";
import { UserTrainingModel } from "../../../models/rest/user/user-training-model";
import {UploadFileBuffModel} from "../../../models/common/upload-file-buff-model";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Scroller} from "primeng/scroller";
import {NgIf} from "@angular/common";
import {DatePicker} from "primeng/datepicker";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";

@Component({
  selector: "popover-user-training-file-add",
  imports: [TranslatePipe, Scroller, NgIf, DatePicker, FormsModule, Button],
  templateUrl: "./user-training-file-add.component.html",
  styleUrl: "./user-training-file-add.component.scss",
  standalone: true
})
export class UserTrainingFileAddComponent {
  @ViewChild("inputFile") inputFile!: ElementRef<HTMLInputElement>;
  @Input() trainingList: UserTrainingModel[] = [];
  @Output() error: EventEmitter<{title: string, msg?: string}> = new EventEmitter();
  @Output() warn: EventEmitter<{title: string, msg?: string}> = new EventEmitter();
  @Output() viewItemEvent: EventEmitter<UserTrainingModel> = new EventEmitter();
  @Output() uploadFileEvent: EventEmitter<{file: UploadFileBuffModel, date: Date}> = new EventEmitter();
  imageCacheUrl: {blobUrl: string, objectUrl: string}[] = [];
  uploadFileBuff?: UploadFileBuffModel;
  trainingDate?: Date;
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
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }
  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      this.setLoading();
      const gatheringFile = (await FExtensions.gatheringAbleFile(event.dataTransfer.files, (file: File): void => {
        this.translateService.get("common-desc.not-supported-file").subscribe(x => {
          this.onWarn("fileUpload", `${file.name} ${x}`);
        });
      })).filter(x => !!x.file);
      if (gatheringFile.length > 0) {
        this.uploadFileBuff = gatheringFile[0];
      }
      this.inputFile.nativeElement.value = "";
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
    for (let training of this.trainingList) {
      const ext = FExtensions.getExtMimeType(training.mimeType);
      if (!FExtensions.isImage(ext)) {
        this.imageCacheUrl.push({
          blobUrl: training.blobUrl,
          objectUrl: FExtensions.extToBlobUrl(ext)
        });
      } else {
        this.imageCacheUrl.push({
          blobUrl: training.blobUrl,
          objectUrl: training.blobUrl,
        });
      }
    }
  }
  getBlobUrl(item: UserTrainingModel): string {
    return this.imageCacheUrl.find(x => x.blobUrl == item.blobUrl)?.objectUrl ?? FConstants.ASSETS_NO_IMAGE;
  }
  async viewTrainingFile(item: UserTrainingModel): Promise<void> {
    this.viewItemEvent.next(item);
  }
  getTrainingDate(item: UserTrainingModel): string {
    return FExtensions.dateToYYYYMMdd(item.trainingDate);
  }

  async fileUpload(): Promise<void> {
    this.inputFile.nativeElement.click();
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
        this.uploadFileBuff = gatheringFile[0];
      }
      this.inputFile.nativeElement.value = "";
      this.setLoading(false);
    }
  }
  async uploadFile(): Promise<void> {
    if (this.uploadFileBuff && this.trainingDate) {
      this.uploadFileEvent.next({file: this.uploadFileBuff, date: this.trainingDate});
    }
    this.uploadFileBuff = undefined;
    this.trainingDate = undefined;
  }
  get acceptFiles(): string {
    return ".jpg,.jpeg,.png,.webp,.bmp,.xlsx,.pdf,.heif,.heic,.gif";
  }
  saveAble(): boolean {
    return !!(this.uploadFileBuff && this.trainingDate);
  }
}

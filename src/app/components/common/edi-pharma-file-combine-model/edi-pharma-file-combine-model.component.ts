import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {EDIPharmaBuffModel} from "../../../models/rest/edi/edi-pharma-buff-model";
import {Panel} from "primeng/panel";
import {Button} from "primeng/button";
import {GalleriaModule} from "primeng/galleria";
import {PrimeTemplate} from "primeng/api";
import {Tooltip} from "primeng/tooltip";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import * as FConstants from "../../../guards/f-constants";
import * as FExtensions from "../../../guards/f-extensions";
import {UploadFileBuffModel} from "../../../models/common/upload-file-buff-model";
import {ProgressSpinner} from "primeng/progressspinner";

@Component({
  selector: "app-edi-pharma-file-combine-model",
  templateUrl: "./edi-pharma-file-combine-model.component.html",
  styleUrl: "./edi-pharma-file-combine-model.component.scss",
  imports: [Panel, Button, GalleriaModule, PrimeTemplate, Tooltip, TranslatePipe, ProgressSpinner],
  standalone: true
})
export class EdiPharmaFileCombineModelComponent {
  @ViewChild("inputFiles") inputFiles!: ElementRef<HTMLInputElement>;
  @Input() pharmaItem: EDIPharmaBuffModel = new EDIPharmaBuffModel();
  @Output() error: EventEmitter<{title: string, msg: string}> = new EventEmitter<{title: string; msg: string}>();
  @Output() warn: EventEmitter<{title: string, msg: string}> = new EventEmitter<{title: string; msg: string}>();
  @Output() changeFile: EventEmitter<EDIPharmaBuffModel> = new EventEmitter<EDIPharmaBuffModel>();
  activeIndex: number = 0;
  isDragging: boolean = false;
  isLoading: boolean = false;
  isCollapsed: boolean = true;
  constructor(private translateService: TranslateService) {
  }

  onError(title: string, msg: string): void {
    this.error.next({title: title, msg: msg});
  }
  onWarn(title: string, msg: string): void {
    this.warn.next({title: title, msg: msg});
  }
  onChangeFile(): void {
    this.changeFile.next(this.pharmaItem);
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }
  setLoading(data: boolean = true): void {
    this.isLoading = data;
  }
  toggle(event: MouseEvent): void {
    const element = event.target as HTMLDivElement;
    if (element?.classList?.contains("p-panel-header")) {
      this.isCollapsed = !this.isCollapsed;
    }
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
        if (this.pharmaItem.uploadFileBuffModel == undefined) {
          this.pharmaItem.uploadFileBuffModel = [];
        }
        this.pharmaItem.uploadFileBuffModel = this.pharmaItem.uploadFileBuffModel.concat(gatheringFile);
        this.pharmaItem.uploadFileBuffModel = FExtensions.distinctByFields(this.pharmaItem.uploadFileBuffModel, ["file.name", "file.size"]);
      }
      this.inputFiles.nativeElement.value = "";
      this.isCollapsed = false;
      this.onChangeFile();
      this.setLoading(false);
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
        if (this.pharmaItem.uploadFileBuffModel == undefined) {
          this.pharmaItem.uploadFileBuffModel = [];
        }
        this.pharmaItem.uploadFileBuffModel = this.pharmaItem.uploadFileBuffModel.concat(gatheringFile);
        this.pharmaItem.uploadFileBuffModel = FExtensions.distinctByFields(this.pharmaItem.uploadFileBuffModel, ["file.name", "file.size"]);
      }
      this.inputFiles.nativeElement.value = "";
      this.isCollapsed = false;
      this.onChangeFile();
      this.setLoading(false);
    }
  }
  get acceptFiles(): string {
    return ".jpg,.jpeg,.png,.webp,.bmp,.xlsx,.pdf,.heif,.heic,.gif";
  }
  deleteUploadFile(data: UploadFileBuffModel): void {
    const index = this.pharmaItem.uploadFileBuffModel.indexOf(data);
    if (index == this.pharmaItem.uploadFileBuffModel.length - 1) {
      if (this.pharmaItem.uploadFileBuffModel.length - 1 > 0) {
        this.activeIndex = this.pharmaItem.uploadFileBuffModel.length - 2;
      } else {
        this.activeIndex = 0;
      }
    }

    if (index >= 0) {
      data.revokeBlob();
      this.pharmaItem.uploadFileBuffModel.splice(index, 1);
    }
    this.onChangeFile();
  }
  thisHeader(): string {
    return `${this.pharmaItem.orgName} (${this.pharmaItem.uploadFileBuffModel.length})`;
  }

  get removeFileTooltip(): string {
    return "common-desc.remove";
  }

  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly galleriaContainerStyleWithThumbnail = FConstants.galleriaContainerStyleWithThumbnail;
}

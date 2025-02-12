import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {EDIApplyDateModel} from "../../../../models/rest/edi/edi-apply-date-model";
import {EDIHosBuffModel} from "../../../../models/rest/edi/edi-hos-buff-model";
import {EDIPharmaBuffModel} from "../../../../models/rest/edi/edi-pharma-buff-model";
import {UploadFileBuffModel} from "../../../../models/common/upload-file-buff-model";
import {EdiRequestService} from "../../../../services/rest/edi-request.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {EDIMedicineBuffModel} from "../../../../models/rest/edi/edi-medicine-buff-model";
import {EDIUploadPharmaModel} from "../../../../models/rest/edi/edi-upload-pharma-model";
import {EDIUploadPharmaMedicineModel} from "../../../../models/rest/edi/edi-upload-pharma-medicine-model";

@Component({
  selector: "app-edi-new-request",
  templateUrl: "./edi-new-request.component.html",
  styleUrl: "./edi-new-request.component.scss",
  standalone: false,
})
export class EdiNewRequestComponent extends FComponentBase {
  @ViewChild("inputFiles") inputFiles!: ElementRef<HTMLInputElement>;
  ediETC: string = "";
  applyDateList: EDIApplyDateModel[] = [];
  selectApplyDate?: EDIApplyDateModel;
  activeIndex: number = 0;
  uploadFileBuffModel: UploadFileBuffModel[] = [];
  saveAble: boolean = false;
  constructor(private thisService: EdiRequestService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }

  override async ngInit(): Promise<void> {
    await this.getApplyDateList();
  }

  async getApplyDateList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getApplyDateList(),
      e => this.fDialogService.error("getApplyDateList", e));
    this.setLoading(false);
    if (ret.result) {
      this.applyDateList = ret.data ?? [];
      if (this.applyDateList.length >= 1) {
        this.selectApplyDate = this.applyDateList[0];
      }
      return;
    }
    this.fDialogService.warn("getApplyDateList", ret.msg);
  }

  async saveData(): Promise<void> {
    if (this.selectApplyDate == null) {
      return;
    }
    if (this.uploadFileBuffModel.length <= 0) {
      return;
    }
    this.setLoading();
    const uploadModel = this.parseUploadData();
    const azureUploadRet = await this.uploadAzure(uploadModel);
    if (!azureUploadRet) {
      this.setLoading(false);
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.postNewData(uploadModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      this.uploadFileBuffModel.forEach(x => x.revokeBlob());
      await this.router.navigate([`${FConstants.EDI_LIST_URL}`]);
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }
  async uploadAzure(uploadModel: EDIUploadModel): Promise<boolean> {
    let ret = true;
    for (const buff of this.uploadFileBuffModel) {
      const blobName = FExtensions.getEDIUploadBlobName(buff.ext);
      const blobStorageInfo = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(blobName),
        e => this.fDialogService.error("saveData", e));
      if (!blobStorageInfo.result) {
        this.fDialogService.warn("saveData", blobStorageInfo.msg);
        ret = false;
        break;
      }
      const uploadFile = FExtensions.getEDIUploadFileModel(buff.file!!, blobStorageInfo.data!!, buff.ext, buff.mimeType);
      await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(buff.file!!, blobStorageInfo.data, uploadFile.blobName, uploadFile.mimeType),
        e => {
          this.fDialogService.error("saveData", e);
          ret = false;
        });
      if (!ret) {
        break;
      }
      uploadModel.fileList.push(uploadFile);
    }

    return ret;
  }

  async applyDateOnSelect(): Promise<void> {
    this.checkSavable();
  }

  parseUploadData(): EDIUploadModel {
    const ret = new EDIUploadModel();
    if (this.selectApplyDate) {
      ret.year = this.selectApplyDate.year;
      ret.month = this.selectApplyDate.month;
    }
    ret.regDate = new Date();
    ret.etc = this.ediETC;

    return ret;
  }

  listItemApplyDateModel(data: EDIApplyDateModel): string {
    return `${data.year}-${data.month}`;
  }
  checkSavable(): void {
    if (this.ediETC.length <= 0) {
      this.saveAble = false;
      return;
    }
    if (this.selectApplyDate == null) {
      this.saveAble = false;
      return;
    }
    if (this.uploadFileBuffModel.length <= 0) {
      this.saveAble = false;
      return;
    }

    this.saveAble = true;
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
          this.fDialogService.warn("fileUpload", `${file.name} ${x}`);
        });
      })).filter(x => !!x.file);
      if (gatheringFile.length > 0) {
        this.uploadFileBuffModel = this.uploadFileBuffModel.concat(gatheringFile);
        this.uploadFileBuffModel = FExtensions.distinctByFields(this.uploadFileBuffModel, ["file.name", "file.size"]);
      }
      this.inputFiles.nativeElement.value = "";
      this.checkSavable();

      this.setLoading(false);
    }
  }
  get acceptFiles(): string {
    return ".jpg,.jpeg,.png,.webp,.bmp,.xlsx,.pdf,.heif,.heic,.gif";
  }
  deleteUploadFile(data: UploadFileBuffModel): void {
    const index = this.uploadFileBuffModel.indexOf(data);
    if (index == this.uploadFileBuffModel.length - 1) {
      if (this.uploadFileBuffModel.length - 1 > 0) {
        this.activeIndex = this.uploadFileBuffModel.length - 2;
      } else {
        this.activeIndex = 0;
      }
    }

    if (index >= 0) {
      data.revokeBlob();
      this.uploadFileBuffModel.splice(index, 1);
    }
  }

  get removeFileTooltip(): string {
    return "common-desc.remove";
  }

  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
}

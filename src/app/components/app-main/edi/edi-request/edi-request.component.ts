import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {EdiRequestService} from "../../../../services/rest/edi-request.service";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {EDIApplyDateModel} from "../../../../models/rest/edi/edi-apply-date-model";
import {EDIPharmaBuffModel} from "../../../../models/rest/edi/edi-pharma-buff-model";
import {EDIMedicineBuffModel} from "../../../../models/rest/edi/edi-medicine-buff-model";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {EDIUploadPharmaModel} from "../../../../models/rest/edi/edi-upload-pharma-model";
import {EDIUploadPharmaMedicineModel} from "../../../../models/rest/edi/edi-upload-pharma-medicine-model";
import {UploadFileBuffModel} from "../../../../models/common/upload-file-buff-model";
import {EDIHosBuffModel} from "../../../../models/rest/edi/edi-hos-buff-model";

@Component({
  selector: "app-edi-request",
  templateUrl: "./edi-request.component.html",
  styleUrl: "./edi-request.component.scss",
  standalone: false,
})
export class EdiRequestComponent extends FComponentBase {
  @ViewChild("inputFiles") inputFiles!: ElementRef<HTMLInputElement>;
  applyDateList: EDIApplyDateModel[] = [];
  selectApplyDate?: EDIApplyDateModel;
  hospitalList: EDIHosBuffModel[] = [];
  pharmaList: EDIPharmaBuffModel[] = [];
  selectHospital?: EDIHosBuffModel;
  selectPharma: EDIPharmaBuffModel[] = [];
  activeIndex: number = 0;
  uploadFileBuffModel: UploadFileBuffModel[] = [];
  saveAble: boolean = false;
  constructor(private thisService: EdiRequestService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }

  override async ngInit(): Promise<void> {
    this.setLoading();
    await this.getApplyDateList();
    await this.getHospitalList();
    this.setLoading(false);
  }

  async getApplyDateList(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.thisService.getApplyDateList(),
      e => this.fDialogService.error("getApplyDateList", e));
    if (ret.result) {
      this.applyDateList = ret.data ?? [];
      if (this.applyDateList.length >= 1) {
        this.selectApplyDate = this.applyDateList[0];
      }
      return;
    }
    this.fDialogService.warn("getApplyDateList", ret.msg);
  }
  async getHospitalList(): Promise<void> {
    if (this.selectApplyDate == null) {
      return;
    }
    const applyDate = `${this.selectApplyDate.year}-${this.selectApplyDate.month}-01`;
    const ret = await FExtensions.restTry(async() => await this.thisService.getHospitalList(applyDate),
      e => this.fDialogService.error("getHospitalList", e));
    if (ret.result) {
      this.hospitalList = ret.data ?? [];
      if (this.hospitalList.length >= 1) {
        this.selectHospital = this.hospitalList[0];
        await this.getPharmaList();
      }
      return;
    }
    this.fDialogService.warn("getHospitalList", ret.msg);
  }
  async getPharmaList(): Promise<void> {
    if (this.selectHospital) {
      this.pharmaList = [...this.selectHospital.pharmaList];
      this.selectPharma = this.pharmaList;
    }
//    const hosPK = this.selectHospital?.thisPK;
//    if (hosPK == null) {
//      return;
//    }
//    if (this.selectApplyDate == null) {
//      return;
//    }
//    const applyDate = `${this.selectApplyDate.year}-${this.selectApplyDate.month}-01`;
//    this.setLoading();
//    const ret = await FExtensions.restTry(async() => await this.thisService.getPharmaList(hosPK, applyDate),
//      e => this.fDialogService.error("getPharmaList", e));
//    this.setLoading(false);
//    if (ret.result) {
//      this.pharmaList = ret.data ?? [];
//      this.selectPharma = this.pharmaList;
//      return;
//    }
//    this.fDialogService.warn("getPharmaList", ret.msg);
  }
  async getMedicineList(): Promise<void> {
    const hosPK = this.selectHospital?.thisPK;
    if (hosPK == null) {
      return;
    }
    const pharmaPK = this.pharmaList.map(x => x.thisPK);
    if (pharmaPK.length <= 0) {
      return;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getMedicineList(hosPK, pharmaPK),
      e => this.fDialogService.warn("getMedicineList", e));
    this.setLoading(false);
    if (ret.result) {
      this.mergePharmaMedicine(this.pharmaList, ret.data ?? []);
      return;
    }
    this.fDialogService.warn("getMedicineList", ret.msg);
  }

  async saveData(): Promise<void> {
    if (this.selectApplyDate == null) {
      return;
    }
    if (this.selectHospital == null) {
      return;
    }
    if (this.selectPharma.length <= 0) {
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
    const ret = await FExtensions.restTry(async() => await this.thisService.postData(uploadModel),
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
      const uploadFile = FExtensions.getEDIUploadFileModel(buff.file!!, buff.ext, buff.mimeType);
      const sasKey = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(uploadFile.blobName),
        e => this.fDialogService.error("saveData", e));
      if (!sasKey.result) {
        this.fDialogService.warn("saveData", sasKey.msg);
        ret = false;
        break;
      }
      await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(buff.file!!, uploadFile.blobName, sasKey.data ?? "", uploadFile.mimeType),
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
    await this.getHospitalList();
    this.checkSavable();
  }
  async hospitalOnSelect(): Promise<void> {
    this.selectPharma = [];
    await this.getPharmaList();
    this.checkSavable();
  }
  async pharmaOnSelect(): Promise<void> {
    this.checkSavable();
  }

  mergePharmaMedicine(pharmaList: EDIPharmaBuffModel[], medicineList: EDIMedicineBuffModel[]): void {
    const medicineMap = medicineList.reduce((acc, medicine) => {
      if (!acc[medicine.pharmaPK]) {
        acc[medicine.pharmaPK] = [];
      }
      acc[medicine.pharmaPK].push(medicine);
      return acc;
    }, {} as Record<string, EDIMedicineBuffModel[]>);
    pharmaList.forEach(x => {
      x.medicineList = medicineMap[x.thisPK] || [];
    });
  }

  parseUploadData(): EDIUploadModel {
    const ret = new EDIUploadModel();
    if (this.selectApplyDate) {
      ret.year = this.selectApplyDate.year;
      ret.month = this.selectApplyDate.month;
    }
    if (this.selectHospital) {
      ret.hospitalPK = this.selectHospital.thisPK;
      ret.orgName = this.selectHospital.orgName;
    }
    this.selectPharma.forEach(pharmaBuff => {
      ret.pharmaList.push(FExtensions.applyClass(EDIUploadPharmaModel, applyPharma => {
        applyPharma.pharmaPK = pharmaBuff.thisPK;
        pharmaBuff.medicineList.forEach(medicineBuff => {
          applyPharma.medicineList.push(FExtensions.applyClass(EDIUploadPharmaMedicineModel, applyMedicine => {
            applyMedicine.pharmaPK = pharmaBuff.thisPK;
            applyMedicine.medicinePK = medicineBuff.thisPK;
          }));
        });
      }));
    });
    ret.regDate = new Date();

    return ret;
  }

  listItemApplyDateModel(data: EDIApplyDateModel): string {
    return `${data.year}-${data.month}`;
  }
  checkSavable(): void {
    if (this.selectApplyDate == null) {
      this.saveAble = false;
      return;
    }
    if (this.selectHospital == null) {
      this.saveAble = false;
      return;
    }
    if (this.selectPharma.length <= 0) {
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

  get hospitalFilterFields(): string[] {
    return ["orgName"];
  }
  get pharmaFilterFields(): string[] {
    return ["orgName"];
  }
  get removeFileTooltip(): string {
    return "common-desc.remove";
  }

  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
}

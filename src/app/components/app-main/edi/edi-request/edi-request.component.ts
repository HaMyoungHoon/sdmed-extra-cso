import {Component} from "@angular/core";
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
  applyDateList: EDIApplyDateModel[] = [];
  selectApplyDate?: EDIApplyDateModel;
  hospitalList: EDIHosBuffModel[] = [];
  pharmaList: EDIPharmaBuffModel[] = [];
  selectHospital?: EDIHosBuffModel;
  saveAble: boolean = false;
  constructor(private thisService: EdiRequestService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }

  override async ngInit(): Promise<void> {
    await this.getApplyDateList();
    await this.getHospitalList();
  }

  onError(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  onWarn(data: {title: string, msg?: string}): void {
    this.fDialogService.warn(data.title, data.msg);
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
  async getHospitalList(): Promise<void> {
    if (this.selectApplyDate == null) {
      return;
    }
    this.setLoading();
    const applyDate = `${this.selectApplyDate.year}-${this.selectApplyDate.month}-01`;
    const ret = await FExtensions.restTry(async() => await this.thisService.getHospitalList(applyDate),
      e => this.fDialogService.error("getHospitalList", e));
    this.setLoading(false);
    if (ret.result) {
      this.hospitalList = ret.data ?? [];
      if (this.hospitalList.length >= 1) {
        this.selectHospital = this.hospitalList[0];
      } else {
        this.selectHospital = undefined;
      }
      await this.getPharmaList();
      return;
    }
    this.fDialogService.warn("getHospitalList", ret.msg);
  }
  async getPharmaList(): Promise<void> {
    if (this.selectHospital) {
      this.pharmaList = [...this.selectHospital.pharmaList];
      this.pharmaList.forEach(x => x.uploadFileBuffModel = []);
    } else {
      this.pharmaList = [];
    }
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

  async mqttSend(thisPK: string | undefined, content: string | undefined): Promise<void> {
    if (thisPK == undefined || content == undefined) {
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.mqttService.postEDIRequest(thisPK, content));
//      e => this.fDialogService.warn("notice", e));
//    if (ret.result) {
//      return;
//    }
//    this.fDialogService.warn("notice", ret.msg);
  }
  async saveData(): Promise<void> {
    if (this.selectApplyDate == null) {
      return;
    }
    if (this.selectHospital == null) {
      return;
    }
    if (this.pharmaList.filter(x => x.uploadFileBuffModel.length > 0).length <= 0) {
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
      this.pharmaList.forEach(x => x.uploadFileBuffModel.forEach(y => y.revokeBlob()));
      await this.mqttSend(ret.data?.thisPK, ret.data?.orgName);
      await this.router.navigate([`${FConstants.EDI_LIST_URL}`]);
      return;
    }
    this.fDialogService.warn("saveData", ret.msg);
  }
  async uploadAzure(uploadModel: EDIUploadModel): Promise<boolean> {
    let ret = true;
    const ablePharma = this.pharmaList.filter(x => x.uploadFileBuffModel.length > 0);
    for (const pharmaBuff of ablePharma) {
      const pharma = FExtensions.applyClass(EDIUploadPharmaModel, obj => {
        obj.pharmaPK = pharmaBuff.thisPK;
      });
      for (const fileBuff of pharmaBuff.uploadFileBuffModel) {
        const blobName = FExtensions.getEDIUploadBlobName(fileBuff.ext);
        const blobStorageInfo = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(blobName),
          e => this.fDialogService.error("saveData", e));
        if (!blobStorageInfo.result) {
          this.fDialogService.warn("saveData", blobStorageInfo.msg);
          ret = false;
          break;
        }
        const uploadFile = FExtensions.getEDIUploadPharmaFileModel(fileBuff.file!!, blobStorageInfo.data!!, fileBuff.ext, fileBuff.mimeType);
        await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(fileBuff.file!!, blobStorageInfo.data, uploadFile.blobName, uploadFile.mimeType),
          e => {
            this.fDialogService.error("saveData", e);
            ret = false;
          });
        if (!ret) {
          break;
        }
        pharma.fileList.push(uploadFile);
      }
      uploadModel.pharmaList.push(pharma);
    }

    return ret;
  }

  async applyDateOnSelect(): Promise<void> {
    await this.getHospitalList();
    this.checkSavable();
  }
  async hospitalOnSelect(): Promise<void> {
    await this.getPharmaList();
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

    return ret;
  }

  pharmaItemChange(pharmaItem: EDIPharmaBuffModel): void {
    const target = this.pharmaList.find(x => x.thisPK == pharmaItem.thisPK);
    if (target) {
      target.uploadFileBuffModel = pharmaItem.uploadFileBuffModel;
    }
    this.checkSavable();
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
    if (this.pharmaList.filter(x => x.uploadFileBuffModel.length > 0).length <= 0) {
      this.saveAble = false;
      return;
    }

    this.saveAble = true;
  }

  get hospitalFilterFields(): string[] {
    return ["orgName"];
  }
  get pharmaFilterFields(): string[] {
    return ["orgName"];
  }

  protected readonly ellipsis = FExtensions.ellipsis;
}

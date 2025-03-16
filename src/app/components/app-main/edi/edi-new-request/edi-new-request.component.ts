import {Component} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {EDIApplyDateModel} from "../../../../models/rest/edi/edi-apply-date-model";
import {EdiRequestService} from "../../../../services/rest/edi-request.service";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {EDIPharmaBuffModel} from "../../../../models/rest/edi/edi-pharma-buff-model";
import {EDIUploadPharmaModel} from "../../../../models/rest/edi/edi-upload-pharma-model";
import {allEDITypeArray, StringToEDIType, StringToEDITypeDesc} from "../../../../models/rest/edi/edi-type";
import {Subject, takeUntil} from "rxjs";
import {HospitalTempModel} from "../../../../models/rest/hospital/hospital-temp-model";

@Component({
  selector: "app-edi-new-request",
  templateUrl: "./edi-new-request.component.html",
  styleUrl: "./edi-new-request.component.scss",
  standalone: false,
})
export class EdiNewRequestComponent extends FComponentBase {
  tempHospitalPK: string = "";
  tempOrgName: string = "";
  selectHospitalBuff: string = "";
  ediTypeList: string[] = [];
  selectedEDIType: string = "";
  applyDateList: EDIApplyDateModel[] = [];
  selectApplyDate?: EDIApplyDateModel;
  pharmaList: EDIPharmaBuffModel[] = [];
  saveAble: boolean = false;
  constructor(private thisService: EdiRequestService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }

  override async ngInit(): Promise<void> {
    this.ediTypeList = allEDITypeArray();
    this.selectedEDIType = this.ediTypeList[0];
    await this.getApplyDateList();
  }

  onError(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  onWarn(data: {title: string, msg?: string}): void {
    this.fDialogService.warn(data.title, data.msg);
  }
  openHospitalFind(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openHospitalTempFindView({
      closable: false,
      closeOnEscape: true,
      maximizable: true,
      width: "85%",
      modal: true,
    }).pipe(takeUntil(sub)).subscribe(x => {
      const buff = x as HospitalTempModel | null;
      if (buff) {
        this.tempHospitalPK = buff.thisPK;
        this.tempOrgName = buff.orgName;
        this.selectHospitalBuff = buff.orgName;
      }
    });
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
        await this.getPharmaListAll();
      }
      return;
    }
    this.fDialogService.warn("getApplyDateList", ret.msg);
  }
  async getPharmaListAll(): Promise<void> {
    if (this.selectApplyDate == null) {
      return;
    }
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getPharmaListAll(),
      e => this.fDialogService.error("getPharmaListAll", e));
    this.setLoading(false);
    if (ret.result) {
      this.pharmaList = ret.data ?? [];
      this.pharmaList.forEach(x => x.uploadFileBuffModel = []);
    }
  }

  async saveData(): Promise<void> {
    if (this.selectApplyDate == null) {
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
    const ret = await FExtensions.restTry(async() => await this.thisService.postNewData(uploadModel),
      e => this.fDialogService.error("saveData", e));
    this.setLoading(false);
    if (ret.result) {
      this.pharmaList.forEach(x => x.uploadFileBuffModel.forEach(y => y.revokeBlob()));
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
    this.checkSavable();
  }

  parseUploadData(): EDIUploadModel {
    const ret = new EDIUploadModel();
    ret.ediType = StringToEDIType[this.selectedEDIType];
    if (this.selectApplyDate) {
      ret.year = this.selectApplyDate.year;
      ret.month = this.selectApplyDate.month;
    }
    if (this.selectHospitalBuff != this.tempOrgName) {
      ret.tempHospitalPK = "";
    } else {
      ret.tempHospitalPK = this.tempHospitalPK;
    }
    ret.tempOrgName = this.tempOrgName;
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
    if (this.tempOrgName.length <= 0) {
      this.saveAble = false;
      return;
    }
    if (this.selectApplyDate == null) {
      this.saveAble = false;
      return;
    }
    if (this.pharmaList.filter(x => x.uploadFileBuffModel.length > 0).length <= 0) {
      this.saveAble = false;
      return;
    }

    this.saveAble = true;
  }

  ediTypeTranslate(item: string): string {
    return `common-desc.${item}`;
  }
  get pharmaFilterFields(): string[] {
    return ["orgName"];
  }

  protected readonly ellipsis = FExtensions.ellipsis;
}

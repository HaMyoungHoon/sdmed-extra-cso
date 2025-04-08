import {ChangeDetectorRef, Component, ElementRef, input, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {flagToRoleDesc, UserRole} from "../../../../models/rest/user/user-role";
import {MyInfoService} from "../../../../services/rest/my-info.service";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import * as FAmhohwa from "../../../../guards/f-amhohwa";
import * as FUserInfoMethod from "../../../../guards/f-user-info-method";
import {transformToBoolean} from "primeng/utils";
import {Subject, takeUntil} from "rxjs";
import {statusToUserStatusDesc} from "../../../../models/rest/user/user-status";
import {UserFileType} from "../../../../models/rest/user/user-file-type";
import {UserTrainingModel} from "../../../../models/rest/user/user-training-model";
import {UploadFileBuffModel} from "../../../../models/common/upload-file-buff-model";
import {UserTrainingFileAddComponent} from "../../../common/user-training-file-add/user-training-file-add.component";
import {ExtraMyInfoResponse} from "../../../../models/rest/user/extra-my-info-response";
import {ExtraMyInfoHospital} from "../../../../models/rest/user/extra-my-info-hospital";

@Component({
  selector: "app-my-info",
  templateUrl: "./my-info.component.html",
  styleUrl: "./my-info.component.scss",
  standalone: false,
})
export class MyInfoComponent extends FComponentBase {
  @ViewChild("userTrainingFileAdd") userTrainingFileAdd!: UserTrainingFileAddComponent;
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("csoReportImageInput") csoReportImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("marketingContractImageInput") marketingContractImageInput!: ElementRef<HTMLInputElement>
  userDataModel: ExtraMyInfoResponse = new ExtraMyInfoResponse();
  selectedHosData: ExtraMyInfoHospital = new ExtraMyInfoHospital();
  constructor(private thisService: MyInfoService, private cd: ChangeDetectorRef) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }

  override async ngInit(): Promise<void> {
    await this.getData();
  }
  onError(data: {title: string, msg?: string}): void {
    this.fDialogService.error(data.title, data.msg);
  }
  onWarn(data: {title: string, msg?: string}): void {
    this.fDialogService.warn(data.title, data.msg);
  }

  async getData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(),
      e => this.fDialogService.error("getData"));
    this.setLoading(false);
    if (ret.result) {
      this.userDataModel = ret.data ?? new ExtraMyInfoResponse();
      this.cd.detectChanges();
      await this.userTrainingFileAdd.readyImage();
      return;
    }
    this.fDialogService.warn("getData", ret.msg);
  }

  passwordChange(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openPasswordChangeDialog({
      modal: true,
      closable: true,
      closeOnEscape: true,
      draggable: false,
      resizable: false,
    }).pipe(takeUntil(sub)).subscribe((x): void => {
    });
  }
  logout(): void {
    FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
    this.router.navigate([`/`]).then();
    this.appConfig.logoutMultiLogin();
  }
  multiLogin(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openSignIn(true).pipe(takeUntil(sub)).subscribe(async() => {
      await this.getData();
    });
  }

  userImageUrl(userFileType: UserFileType): string {
    const file = this.userDataModel.fileList.find(x => x.userFileType == userFileType);
    if (file) {
      return FExtensions.blobUrlThumbnail(file.blobUrl, file.mimeType);
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  userImageView(userFileType: UserFileType): void {
    const file = this.userDataModel.fileList.find(x => x.userFileType == userFileType);
    let input: ElementRef<HTMLInputElement>;
    switch (userFileType) {
      case UserFileType.Taxpayer: input = this.taxpayerImageInput; break;
      case UserFileType.BankAccount: input = this.bankAccountImageInput; break;
      case UserFileType.CsoReport: input = this.csoReportImageInput; break;
      case UserFileType.MarketingContract: input = this.marketingContractImageInput; break;
      default: return;
    }
    FUserInfoMethod.userImageView(file, input, this.fDialogService);
  }
  async userImageSelected(event: any, userFileType: UserFileType): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.imageSelected(event, this.userDataModel, userFileType, this.thisService, this.commonService, this.azureBlobService),
      e => this.fDialogService.error(`${userFileType}`, e));
    this.setLoading(false);
    switch (userFileType) {
      case UserFileType.Taxpayer: this.taxpayerImageInput.nativeElement.value = ""; break;
      case UserFileType.BankAccount: this.bankAccountImageInput.nativeElement.value = ""; break;
      case UserFileType.CsoReport: this.csoReportImageInput.nativeElement.value = ""; break;
      case UserFileType.MarketingContract: this.marketingContractImageInput.nativeElement.value = ""; break;
    }
    if (ret.result) {
      if (ret.data) {
        this.userDataModel.fileList.push(ret.data)
      }
      return;
    }
    this.fDialogService.warn(`${userFileType}`, ret.msg);
  }

  trainingImageUrl(): string {
    const file = this.userDataModel.trainingList;
    if (file.length > 0) {
      return FExtensions.blobUrlThumbnail(file[0].blobUrl, file[0].mimeType);
    }
    return FConstants.ASSETS_NO_IMAGE;
  }
  trainingDate(): string {
    const file = this.userDataModel.trainingList;
    if (file.length <= 0) {
      return "";
    }
    return FExtensions.dateToYYYYMMdd(file[0].trainingDate);
  }
  trainingImageTooltip(): string {
    return "user-edit.detail.training-image";
  }
  trainingImageView(): void {
    const file = this.userDataModel.trainingList;
    if (file.length <= 0) {
      return;
    }
//    FUserInfoMethod.userTrainingImageView(file, this.fDialogService);
  }
  viewUserTrainingItem(item: UserTrainingModel): void {
//    this.fDialogService.openFullscreenFileView({
//      closable: false,
//      closeOnEscape: true,
//      maximizable: true,
//      width: "100%",
//      height: "100%",
//      data: {
//        file: FExtensions.userTrainingListToViewModel(this.userDataModel.trainingList),
//        index: this.userDataModel.trainingList.findIndex(x => x.thisPK == item.thisPK)
//      }
//    });
  }
  async userTrainingUpload(data: {file: UploadFileBuffModel, date: Date}): Promise<void> {
    const file = data.file.file;
    if (file == undefined) {
      return;
    }
    this.setLoading();
    const blobName = FExtensions.getUserBlobName(this.userDataModel.id, data.file.ext);
    const blobStorageInfo = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(blobName),
      e => this.fDialogService.error("upload", e));
    if (blobStorageInfo.result != true || blobStorageInfo.data == undefined) {
      this.setLoading(false);
      this.fDialogService.error("upload", blobStorageInfo.msg);
      return;
    }
    const blobModel = FExtensions.getUserBlobModel(file, blobStorageInfo.data, blobName, data.file.ext);
    let uploadRet = true;
    const azureRet = await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(file, blobStorageInfo.data, blobModel.blobName, blobModel.mimeType),
      e => {
        this.fDialogService.error("upload", e);
        uploadRet = false;
      });
    if (azureRet == null || !uploadRet) {
      this.setLoading(false);
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.postUserTrainingData(blobModel, FExtensions.dateToYYYYMMdd(data.date)),
      e => this.fDialogService.error("upload", e));
    this.setLoading(false);
    if (ret.result) {
      this.translateService.get("user-edit.detail.training-image").subscribe(x => {
        this.mqttService.postUserFileAdd(x);
      });
      if (ret.data) {
        this.userDataModel.trainingList.unshift(ret.data);
        await this.userTrainingFileAdd.readyImage();
      }
      return;
    }
    this.fDialogService.warn("upload", ret.msg);
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionValue = ["0"];

  protected readonly getSeverity = FExtensions.getUserStatusSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
  protected readonly dateToYearFullString = FExtensions.dateToYearFullString;
  protected readonly dateToYYYYMMDD = FExtensions.dateToYYYYMMdd;
  protected readonly stringToDate = FExtensions.stringToDate;
  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
  protected readonly UserFileType = UserFileType;
}

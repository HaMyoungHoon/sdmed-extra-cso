import {Component, ElementRef, input, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {flagToRoleDesc, UserRole} from "../../../../models/rest/user/user-role";
import {MyInfoService} from "../../../../services/rest/my-info.service";
import {UserDataModel} from "../../../../models/rest/user/user-data-model";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import * as FAmhohwa from "../../../../guards/f-amhohwa";
import * as FUserInfoMethod from "../../../../guards/f-user-info-method";
import {transformToBoolean} from "primeng/utils";
import {Subject, takeUntil} from "rxjs";
import {statusToUserStatusDesc} from "../../../../models/rest/user/user-status";
import {HospitalModel} from "../../../../models/rest/hospital/hospital-model";
import {UserFileType} from "../../../../models/rest/user/user-file-type";

@Component({
  selector: "app-my-info",
  templateUrl: "./my-info.component.html",
  styleUrl: "./my-info.component.scss",
  standalone: false,
})
export class MyInfoComponent extends FComponentBase {
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("csoReportImageInput") csoReportImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("marketingContractImageInput") marketingContractImageInput!: ElementRef<HTMLInputElement>
  userDataModel: UserDataModel = new UserDataModel();
  selectedHosData: HospitalModel = new HospitalModel();
  constructor(private thisService: MyInfoService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }

  override async ngInit(): Promise<void> {
    await this.getData();
  }

  async getData(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getData(),
      e => this.fDialogService.error("getData"));
    this.setLoading(false);
    if (ret.result) {
      this.userDataModel = ret.data ?? new UserDataModel();
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

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionValue = ["0"];

  protected readonly getSeverity = FExtensions.getUserStatusSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
  protected readonly dateToYearFullString = FExtensions.dateToYearFullString;
  protected readonly stringToDate = FExtensions.stringToDate;
  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
  protected readonly UserFileType = UserFileType;
}

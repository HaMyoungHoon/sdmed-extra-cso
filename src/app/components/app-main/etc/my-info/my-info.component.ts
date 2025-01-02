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

@Component({
  selector: "app-my-info",
  templateUrl: "./my-info.component.html",
  styleUrl: "./my-info.component.scss",
  standalone: false,
})
export class MyInfoComponent extends FComponentBase {
  @ViewChild("taxpayerImageInput") taxpayerImageInput!: ElementRef<HTMLInputElement>
  @ViewChild("bankAccountImageInput") bankAccountImageInput!: ElementRef<HTMLInputElement>
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
    this.router.navigate([`/${FConstants.DASH_BOARD_URL}`]).then();
  }

  get taxpayerImageAble(): boolean {
    return this.userDataModel.taxpayerImageUrl.length > 0;
  }
  get taxpayerImageUrl(): string {
    if (this.userDataModel.taxpayerImageUrl.length > 0) {
      return this.userDataModel.taxpayerImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  taxpayerImageView(): void {
    FUserInfoMethod.userImageView(this.userDataModel.taxpayerImageUrl, this.taxpayerImageInput, this.fDialogService);
  }
  async taxpayerImageSelected(event: any): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.taxpayerImageSelected(event, this.userDataModel, this.thisService, this.commonService, this.azureBlobService),
      e => this.fDialogService.error("taxpayerImageSelected", e));
    this.setLoading(false);
    this.taxpayerImageInput.nativeElement.value = "";
    if (ret.result) {
      this.userDataModel.taxpayerImageUrl = ret.data?.taxpayerImageUrl ?? ""
      return;
    }
    this.fDialogService.warn("taxpayerImageSelected", ret.msg);
  }
  get bankAccountImageAble(): boolean {
    return this.userDataModel.bankAccountImageUrl.length > 0;
  }
  get bankAccountImageUrl(): string {
    if (this.userDataModel.bankAccountImageUrl.length > 0) {
      return this.userDataModel.bankAccountImageUrl
    }

    return FConstants.ASSETS_NO_IMAGE;
  }
  bankAccountImageView(): void {
    FUserInfoMethod.userImageView(this.userDataModel.bankAccountImageUrl, this.bankAccountImageInput, this.fDialogService);
  }
  async bankAccountImageSelected(event: any): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await FUserInfoMethod.bankAccountImageSelected(event, this.userDataModel, this.thisService, this.commonService, this.azureBlobService),
      e => this.fDialogService.error("bankAccountImageSelected", e));
    this.setLoading(false);
    this.bankAccountImageInput.nativeElement.value = "";
    if (ret.result) {
      this.userDataModel.bankAccountImageUrl = ret.data?.bankAccountImageUrl ?? ""
      return;
    }
    this.fDialogService.warn("bankAccountImageView", ret.msg);
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionValue = ["0"];

  protected readonly getSeverity = FExtensions.getUserStatusSeverity;
  protected readonly flagToRoleDesc = flagToRoleDesc;
  protected readonly dateToYearFullString = FExtensions.dateToYearFullString;
  protected readonly stringToDate = FExtensions.stringToDate;
  protected readonly statusToUserStatusDesc = statusToUserStatusDesc;
}

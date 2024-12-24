import {AfterViewInit, Component, inject} from "@angular/core";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {CommonService} from "../services/rest/common.service";
import {FDialogService} from "../services/common/f-dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {AzureBlobService} from "../services/rest/azure-blob.service";
import {haveRole, UserRole} from "../models/rest/user/user-role";
import * as FExtensions from "./f-extensions";

@Component({
  selector: "f-dialog-component-base",
  template: "",
  standalone: false
})
export abstract class FDialogComponentBase implements AfterViewInit {
  myRole?: number = 0;
  haveRole: boolean = false;
  isLoading: boolean = false;
  isMobile: boolean = false;
  protected roleCheck: boolean = true;
  protected ref: DynamicDialogRef;
  protected dialogService: DialogService;
  protected commonService: CommonService;
  protected fDialogService: FDialogService;
  protected translateService: TranslateService;
  protected azureBlobService: AzureBlobService;

  protected constructor(protected arrayRole: Array<UserRole> = Array<UserRole>(UserRole.None)) {
    this.ref = inject(DynamicDialogRef);
    this.dialogService = inject(DialogService);
    this.commonService = inject(CommonService);
    this.fDialogService = inject(FDialogService);
    this.translateService = inject(TranslateService);
    this.azureBlobService = inject(AzureBlobService);
  }

  async ngAfterViewInit(): Promise<void> {
    this.isMobile = !navigator.userAgent.includes("Window");
    if (this.roleCheck) {
      await this.getMyRole();
    }
    await this.ngInit();
  }
  async getMyRole(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.commonService.getMyRole(),
      e => this.fDialogService.error("getMyRole", e));
    this.setLoading(false);
    if (ret.result) {
      this.myRole = ret.data;
      this.haveRole = haveRole(ret.data, this.arrayRole)
      return;
    }

    this.fDialogService.warn("getMyRole", ret.msg);
    return;
  }

  async ngInit(): Promise<void> {

  }

  setLoading(data: boolean = true): void {
    this.isLoading = data;
  }
}

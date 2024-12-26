import {AfterViewInit, Component, inject} from "@angular/core";
import * as FAmhohwa from "./f-amhohwa";
import * as FConstants from "./f-constants";
import * as FExtensions from "./f-extensions";
import {haveRole, UserRole} from "../models/rest/user/user-role";
import {FDialogService} from "../services/common/f-dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {CommonService} from "../services/rest/common.service";
import {AppConfigService} from "../services/common/app-config.service";
import {AzureBlobService} from "../services/rest/azure-blob.service";
import {UserStatus} from "../models/rest/user/user-status";
import {Router} from "@angular/router";

@Component({
  selector: "f-component-base",
  template: "",
  standalone: false
})

export abstract class FComponentBase implements AfterViewInit {
  myRole: number = 0;
  myState: UserStatus = UserStatus.None;
  haveRole: boolean = false;
  isLoading: boolean = false;
  isMobile: boolean = false;
  protected commonService: CommonService;
  protected fDialogService: FDialogService;
  protected translateService: TranslateService;
  protected configService: AppConfigService;
  protected azureBlobService: AzureBlobService;
  protected router: Router
  protected constructor(protected arrayRole: Array<UserRole> = Array<UserRole>(UserRole.None)) {
    this.commonService = inject(CommonService);
    this.fDialogService = inject(FDialogService);
    this.translateService = inject(TranslateService);
    this.configService = inject(AppConfigService);
    this.azureBlobService = inject(AzureBlobService);
    this.router = inject(Router);
  }

  async ngAfterViewInit(): Promise<void> {
    this.isMobile = !navigator.userAgent.includes("Window");
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (FAmhohwa.isExpired(authToken)) {
      return;
    }
    await this.getMyState();
    if (this.myState != UserStatus.Live) {
      return;
    }
    await this.getMyRole();
    if (!this.haveRole) {
      return;
    }
    await this.ngInit();
  }
  async getMyRole(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.commonService.getMyRole(),
      e => this.fDialogService.error("getMyRole", e));
    this.setLoading(false);
    if (ret.result) {
      this.myRole = ret.data ?? 0;
      this.haveRole = haveRole(ret.data, this.arrayRole)
      return;
    }

    this.fDialogService.warn("getMyRole", ret.msg);
    return;
  }
  async getMyState(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => this.commonService.getMyState(),
      e => this.fDialogService.error("getMyState", e));
    this.setLoading(false);
    if (ret.result) {
      this.myState = ret.data ?? UserStatus.None;
      if (this.myState != UserStatus.Live) {
        FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
        this.router.navigate([`/${FConstants.DASH_BOARD_URL}`]).then();
      }
      return;
    }
    this.fDialogService.warn("getMyState", ret.msg);
  }

  async ngInit(): Promise<void> {

  }

  setLoading(data: boolean = true): void {
    this.isLoading = data;
  }
}

import {afterNextRender, ChangeDetectorRef, Component} from "@angular/core";
import {Toolbar} from "primeng/toolbar";
import {Button} from "primeng/button";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {LanguageService} from "../../../services/common/language.service";
import {MenuItem} from "primeng/api";
import {AppConfigService} from "../../../services/common/app-config.service";
import {MainMenuItem} from "../../../models/common/main-menu-item";
import {LangType} from "../../../models/common/lang-type";
import * as FAmhohwa from "../../../guards/f-amhohwa";
import * as FConstants from "../../../guards/f-constants";
import {FDialogService} from "../../../services/common/f-dialog.service";
import * as FExtensions from "../../../guards/f-extensions";
import {Menu} from "primeng/menu";
import {Ripple} from "primeng/ripple";
import {Badge} from "primeng/badge";
import {CommonService} from "../../../services/rest/common.service";
import {Drawer} from "primeng/drawer";

@Component({
  selector: "app-menu-config",
  imports: [
    TranslatePipe,
    Badge,
    Drawer,
    Menu,
    RouterLink,
    Ripple,
    Button,
    Toolbar,
    NgIf
  ],
  templateUrl: "./menu-config.component.html",
  styleUrl: "./menu-config.component.scss",
  standalone: true,
})
export class MenuConfigComponent {
  menuButtonVisible: boolean = false;
  menuItems: MenuItem[] = [];
  constructor(private cd: ChangeDetectorRef, private langService: LanguageService, private configService: AppConfigService, private commonService: CommonService, private fDialogService: FDialogService) {
    afterNextRender(() => {
      this.cd.markForCheck();
    });
  }
  menuInit(visible: boolean): void {
    this.menuButtonVisible = visible;
    this.menuItems = visible ? MainMenuItem() : [];
  }
  menuClose(): void {
    this.configService.hideMenu();
  }
  toggleMenu(): void {
    if (this.menuVisible) {
      this.configService.hideMenu();
    } else {
      this.configService.showMenu();
    }
  }
  async tokenRefresh(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.commonService.tokenRefresh(),
      e => this.fDialogService.error("refresh", e));
    if (ret.result) {
      FAmhohwa.setLocalStorage(FConstants.AUTH_TOKEN, ret.data ?? "");
      return;
    }
  }
  get menuVisible(): boolean {
    return this.configService.isMenuActive();
  }
  get expiredDate(): string {
    return FExtensions.dateToMonthFullString(FAmhohwa.getTokenExpiredDate(FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN)));
  }
  get expiredButtonVisible(): boolean {
    if (!this.menuButtonVisible) {
      return false;
    }

    let authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (authToken.length <= 0) {
      return false;
    }

    let tokenDate = FAmhohwa.getTokenExpiredDate(authToken);
    let now = new Date();
    tokenDate.setDate(tokenDate.getDate() - 10);

    return now.getTime() > tokenDate.getTime();
  }
  async langToEn(): Promise<void> {
    await this.langService.change(LangType.en);
  }
  async langToKo(): Promise<void> {
    await this.langService.change(LangType.ko);
  }
  changeTheme(toDark: boolean): void {
    this.configService.toggleDarkMode(toDark);
  }

  get isKoLang(): boolean {
    return this.langService.isKoLang();
  }
  get isDarkMode(): boolean {
    return this.configService.isDarkMode();
  }
  isSVGIcon(item: MenuItem): boolean {
    const ret = item["path"];
    return !!ret;
  }
  fillColor(): string {
    if (this.isDarkMode) {
      return "#FFFFFF";
    } else {
      return "#4b5563"
    }
  }
  itemPath(item: MenuItem): string {
    return item["path"];
  }
  itemHeight(item: MenuItem): string {
    return item["height"];
  }
  itemWidth(item: MenuItem): string {
    return item["width"];
  }
  itemViewBox(item: MenuItem): string {
    return item["viewBox"];
  }
}

import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {FDialogService} from "../../services/common/f-dialog.service";
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from "@angular/router";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FConstants from "../../guards/f-constants";
import {MenuConfigComponent} from "../common/menu-config/menu-config.component";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: "app-app-main",
  imports: [RouterOutlet, MenuConfigComponent],
  templateUrl: "./app-main.component.html",
  styleUrl: "./app-main.component.scss",
  standalone: true
})
export class AppMainComponent implements AfterViewInit {
  @ViewChild("menuConfig") menuConfig!: MenuConfigComponent;
  viewPage: boolean;
  protected sub: Subject<any>[] = [];
  constructor(private cd: ChangeDetectorRef, private router: Router, private fDialogService: FDialogService) {
    this.viewPage = false;
  }

  ngAfterViewInit(): void {
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (FAmhohwa.isExpired(authToken)) {
      FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
      this.initChildComponents(false);
      this.openSignIn();
      return;
    }

    this.initChildComponents(true);
    this.bindRouteEvents();
  }
  openSignIn(): void {
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.fDialogService.openSignIn().pipe(takeUntil(sub)).subscribe(() => {
      this.closeSignIn();
    });
  }
  closeSignIn(): void {
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (FAmhohwa.isExpired(authToken)) {
      this.initChildComponents(false);
      return;
    }

    this.initChildComponents(true);
    this.cd.detectChanges();
    this.bindRouteEvents();
  }

  initChildComponents(data: boolean): void {
    this.viewPage = data;
    this.menuConfig.menuInit(data);
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (this.router.url == "/" && !FAmhohwa.isExpired(authToken)) {
      this.router.navigate([`/${FConstants.DASH_BOARD_URL}`]).then();
    }
  }

  unbindRouteEvents(): void {
  }
  bindRouteEvents(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
        if (FAmhohwa.isExpired(authToken)) {
          FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
          this.initChildComponents(false);
          this.openSignIn();
        }
      }
      if (event instanceof NavigationEnd) {
        this.menuConfig.menuClose();
      }
    });
  }
}

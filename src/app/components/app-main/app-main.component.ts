import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, ViewChild} from "@angular/core";
import {FDialogService} from "../../services/common/f-dialog.service";
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from "@angular/router";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FConstants from "../../guards/f-constants";
import * as FExtensions from "../../guards/f-extensions";
import {MenuConfigComponent} from "../common/menu-config/menu-config.component";
import {Subject, takeUntil} from "rxjs";
import {MqttConnectModel} from "../../models/rest/mqtt/mqtt-connect-model";
import {MqttService} from "../../services/rest/mqtt.service";
import {MqttContentModel} from "../../models/rest/mqtt/mqtt-content-model";
import {MqttContentType} from "../../models/rest/mqtt/mqtt-content-type";

@Component({
  selector: "app-app-main",
  imports: [RouterOutlet, MenuConfigComponent],
  templateUrl: "./app-main.component.html",
  styleUrl: "./app-main.component.scss",
  standalone: true
})
export class AppMainComponent implements AfterViewInit, OnDestroy {
  @ViewChild("menuConfig") menuConfig!: MenuConfigComponent;
  viewPage: boolean = false;
  protected sub: Subject<any>[] = [];
  mqttConnectModel: MqttConnectModel = new MqttConnectModel();
  protected mqttService: MqttService;
  constructor(private cd: ChangeDetectorRef, private router: Router, private fDialogService: FDialogService) {
    this.mqttService = inject(MqttService);
  }

  async ngAfterViewInit(): Promise<void> {
    const authToken = FAmhohwa.getLocalStorage(FConstants.AUTH_TOKEN);
    if (FAmhohwa.isExpired(authToken)) {
      FAmhohwa.removeLocalStorage(FConstants.AUTH_TOKEN);
      this.initChildComponents(false);
      this.openSignIn();
      return;
    }

    this.initChildComponents(true);
    await this.bindRouteEvents();
  }
  ngOnDestroy(): void {
    this.mqttService.mqttDisconnect();
    for (const buff of this.sub) {
      buff.complete();
    }
  }

  openSignIn(): void {
    this.unbindRouteEvents();
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
    if (!data) {
      this.mqttService.mqttDisconnect();
    }
  }

  unbindRouteEvents(): void {
    for (const buff of this.sub) {
      buff.complete();
    }
    this.mqttService.mqttDisconnect();
  }
  async bindRouteEvents(): Promise<void> {
    const sub = new Subject();
    this.sub.push(sub);
    this.router.events.pipe(takeUntil(sub)).subscribe((event) => {
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
    await this.mqttInit();
  }

  async mqttInit(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.mqttService.getSubscribe(),
      e => this.fDialogService.error("mqttInit", e));
    if (!ret.result || ret.data == null) {
      this.fDialogService.warn("mqttInit", ret.msg);
      return;
    }
    this.mqttConnectModel = ret.data;
    this.mqttService.setMqttMessageObserver(x => {
      this.mqttMessageParse(x);
    });
    FExtensions.tryCatch(() => this.mqttService.mqttConnect(this.mqttConnectModel), e => this.fDialogService.error("mqttInit", e));
  }

  async mqttMessageParse(mqttContentModel: MqttContentModel): Promise<void> {
    if (mqttContentModel.senderPK == FAmhohwa.getThisPK()) {
      return;
    }
    let title: string = "";
    switch (mqttContentModel.contentType) {
      case MqttContentType.None: title = "mqtt-desc.title.none"; break;
      case MqttContentType.QNA_REQUEST: title = "mqtt-desc.title.qna-request"; break;
      case MqttContentType.QNA_REPLY: title = "mqtt-desc.title.qna-reply"; break;
      case MqttContentType.EDI_REQUEST: title = "mqtt-desc.title.edi-request"; break;
      case MqttContentType.EDI_REJECT: title = "mqtt-desc.title.edi-reject"; break;
      case MqttContentType.EDI_OK: title = "mqtt-desc.title.edi-ok"; break;
      case MqttContentType.EDI_RECEP: title = "mqtt-desc.title.edi-recep"; break;
      case MqttContentType.EDI_FILE_ADD: title = "mqtt-desc.title.edi-file-add"; break;
      case MqttContentType.EDI_FILE_DELETE: title = "mqtt-desc.title.edi-file-delete"; break;
    }
//    this.fDialogService.mqttInfo(title, mqttContentModel.senderID,`${mqttContentModel.content}`, this.mqttConfirmFn, mqttContentModel);
    this.fDialogService.mqttInfo(title, " ",`${mqttContentModel.content}`, this.mqttConfirmFn, mqttContentModel);
  }
  async mqttConfirmFn(event: MouseEvent, message: any, router: Router): Promise<void> {
    const mqttContentModel = message.data["this-data"] as MqttContentModel;
    router.navigateByUrl("/", { skipLocationChange: true }).then(async() => {
      switch (mqttContentModel.contentType) {
        case MqttContentType.None: await router.navigate([`/${FConstants.DASH_BOARD_URL}`]); break;
        case MqttContentType.QNA_REQUEST:
        case MqttContentType.QNA_REPLY: await router.navigate([`/${FConstants.QNA_LIST_URL}/${mqttContentModel.targetItemPK}`]); break;
        case MqttContentType.EDI_REQUEST:
        case MqttContentType.EDI_REJECT:
        case MqttContentType.EDI_OK:
        case MqttContentType.EDI_RECEP:
        case MqttContentType.EDI_FILE_ADD:
        case MqttContentType.EDI_FILE_DELETE: await router.navigate([`/${FConstants.EDI_LIST_URL}/${mqttContentModel.targetItemPK}`]); break;
      }
    });
  }
}

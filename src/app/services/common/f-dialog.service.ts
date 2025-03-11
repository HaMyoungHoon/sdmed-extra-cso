import { Injectable } from "@angular/core";
import {ToastLevel} from "../../models/common/toast-level";
import {ToastItem} from "../../models/common/toast-item";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Observable} from "rxjs";
import {MessageService} from "primeng/api";
import {SignDialogComponent} from "../../components/common/dialog/sign-dialog/sign-dialog.component";
import {PasswordChangeDialogComponent} from "../../components/common/dialog/password-change-dialog/password-change-dialog.component";
import {FullScreenFileViewDialogComponent} from "../../components/common/dialog/full-screen-file-view-dialog/full-screen-file-view-dialog.component";
import {Router} from "@angular/router";
import {HowMuchDialogComponent} from "../../components/common/dialog/how-much-dialog/how-much-dialog.component";
import {
  HospitalTempFindComponent
} from "../../components/common/dialog/hospital-temp-find/hospital-temp-find.component";
import {
  HospitalTempDetailComponent
} from "../../components/common/dialog/hospital-temp-detail/hospital-temp-detail.component";

@Injectable({
  providedIn: "root"
})
export class FDialogService {
  ref?: DynamicDialogRef
  constructor(private dialogService: DialogService, private messageService: MessageService) { }

  openSignIn(): Observable<any> {
    this.ref = this.dialogService.open(SignDialogComponent, {
      header: "sign in",
      modal: true,
      closable: true,
      closeOnEscape: false,
    });

    return this.ref.onClose;
  }
  openHospitalTempFindView(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(HospitalTempFindComponent, config);
    return this.ref.onClose;
  }
  openHospitalTempDetailView(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(HospitalTempDetailComponent, config);
    return this.ref.onClose;
  }
  openHowMuchView(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(HowMuchDialogComponent, config);
    return this.ref.onClose;
  }
  openFullscreenFileView(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(FullScreenFileViewDialogComponent, config);
    return this.ref.onClose;
  }
  openPasswordChangeDialog(config: DynamicDialogConfig): Observable<any> {
    this.ref = this.dialogService.open(PasswordChangeDialogComponent, config);
    return this.ref.onClose;
  }
//  openImageView(config: DynamicDialogConfig): Observable<any> {
//    this.ref = this.dialogService.open(ImageViewDialogComponent, config);
//    return this.ref.onClose;
//  }
  alertToast(data: ToastItem): void {
    this.add(data.level, data.title, data.detail)
  }
  alert(level: ToastLevel, title: string, detail: string): void {
    this.add(level, title, detail, true);
  }
  warn(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    this.add(ToastLevel.warn, title, detail);
  }
  error(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    this.add(ToastLevel.error, title, detail);
  }
  info(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    this.add(ToastLevel.info, title, detail, true);
  }
  mqttInfo(title: string, detail?: string, text?: any, confirmFn?: (event: MouseEvent, message: any, router: Router) => void, thisData?: any): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    this.add(ToastLevel.info, title, detail, text, true, confirmFn, thisData, "common-desc.move");
  }
  success(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    this.add(ToastLevel.success, title, detail);
  }

  add(severity: string, title: string, detail?: string, text?: any, sticky: boolean = false,
      confirmFn?: (event: MouseEvent, message: any, router: Router) => void, thisData?: any,
      confirmLabel: string = "common-desc.confirm"): void {
    this.messageService.add({
      severity: severity,
      summary: title,
      detail: detail,
      text: text,
      sticky: sticky,
      data: {
        "this-data": thisData,
        "confirm-label": confirmLabel,
        "confirm-able": confirmFn,
        confirmFn: (event: MouseEvent, message: any, router: Router): void => {
          if (confirmFn) confirmFn(event, message, router);
        }
      }
    });
  }
}

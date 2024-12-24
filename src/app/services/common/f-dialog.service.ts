import { Injectable } from "@angular/core";
import {ToastLevel} from "../../models/common/toast-level";
import {ToastItem} from "../../models/common/toast-item";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Observable} from "rxjs";
import {MessageService} from "primeng/api";
import {SignDialogComponent} from "../../components/common/dialog/sign-dialog/sign-dialog.component";

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
//  openImageView(config: DynamicDialogConfig): Observable<any> {
//    this.ref = this.dialogService.open(ImageViewDialogComponent, config);
//    return this.ref.onClose;
//  }
  alertToast(data: ToastItem): void {
    this.add(data.level, data.title, data.detail)
  }
  alert(level: ToastLevel, title: string, detail: string): void {
    this.add(level, title, detail);
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
    this.add(ToastLevel.info, title, detail);
  }
  success(title: string, detail?: string): void {
    if ((detail?.length ?? 0) <= 0) {
      return;
    }
    this.add(ToastLevel.success, title, detail);
  }

  add(severity: string, title: string, detail?: string): void {
    this.messageService.add({
      severity: severity,
      summary: title,
      detail: detail
    });
  }
}

import {Component, ViewChild} from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import {DashboardService} from "../../../../services/rest/dashboard.service";
import {HowMuchModel} from "../../../../models/rest/how-much-model";
import {Table, TableModule} from "primeng/table";
import * as FExtensions from "../../../../guards/f-extensions";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {TranslatePipe} from "@ngx-translate/core";
import * as FConstants from "../../../../guards/f-constants";
import {ellipsis} from "../../../../guards/f-extensions";
import {StringToEDIStateDesc} from "../../../../models/rest/edi/edi-state";

@Component({
  selector: "app-how-much-dialog",
  imports: [IconField, InputIcon, InputText, TableModule, TranslatePipe],
  templateUrl: "./how-much-dialog.component.html",
  styleUrl: "./how-much-dialog.component.scss",
  standalone: true,
})
export class HowMuchDialogComponent extends FDialogComponentBase {
  @ViewChild("listTable") listTable!: Table;
  initList: HowMuchModel[] = [];
  viewList: HowMuchModel[] = [];
  isSorted: boolean | null = null;
  date: string;
  hosPK: string;
  pharmaPK: string;
  constructor(private thisService: DashboardService) {
    super();
    const dlg = this.dialogService.getInstance(this.ref);
    this.date = dlg.data.date;
    this.hosPK = dlg.data.hosPK;
    this.pharmaPK = dlg.data.pharmaPK;
  }

  override async ngInit(): Promise<void> {
    this.dialogService.getInstance(this.ref).maximize();
    this.setLoading();
    await this.getHosData();
    await this.getPharmaData();
    this.setLoading(false);
  }

  async getHosData(): Promise<void> {
    if (this.hosPK.length <= 0) {
      return;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.getListHosDetail(this.hosPK, this.date),
      e => this.fDialogService.error("get data", e));
    if (ret.result) {
      this.initList = ret.data ?? [];
      this.viewList = [...this.initList];
      return;
    }
    this.fDialogService.warn("get data", ret.msg);
  }
  async getPharmaData(): Promise<void> {
    if (this.pharmaPK.length <= 0) {
      return;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.getListPharmaDetail(this.pharmaPK, this.date),
      e => this.fDialogService.error("get data", e));
    if (ret.result) {
      this.initList = ret.data ?? [];
      this.viewList = [...this.initList];
      return;
    }
    this.fDialogService.warn("get data", ret.msg);
  }

  get filterFields(): string[] {
    return ["hospitalName", "pharmaName", "medicineName", "ediState"];
  }

  protected readonly filterTable = FExtensions.filterTable;
  protected readonly filterTableOption = FConstants.filterTableOption;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly customSort = FExtensions.customSort;
  protected readonly ellipsis = ellipsis;
  protected readonly StringToEDIStateDesc = StringToEDIStateDesc;
}

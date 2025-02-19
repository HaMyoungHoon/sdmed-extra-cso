import {Component, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import * as FImageCache from "../../../../guards/f-image-cache";
import {EDIUploadModel} from "../../../../models/rest/edi/edi-upload-model";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import {Calendar} from "primeng/calendar";
import {StringToEDIStateDesc} from "../../../../models/rest/edi/edi-state";

@Component({
  selector: "app-edi-list",
  templateUrl: "./edi-list.component.html",
  styleUrl: "./edi-list.component.scss",
  standalone: false,
})
export class EdiListComponent extends FComponentBase{
  @ViewChild("startCalendar") startCalendar !: Calendar;
  @ViewChild("endCalendar") endCalendar !: Calendar;
  startDate: Date = FExtensions.plusMonths(new Date(), -1);
  endDate: Date = new Date();
  isSorted: boolean | null = null;
  initValue: EDIUploadModel[] = [];
  viewList: EDIUploadModel[] = [];
  constructor(private thisService: EdiListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }

  override async ngInit(): Promise<void> {
    await this.getList();
  }

  async getList(): Promise<void> {
    this.setLoading();
    await FExtensions.tryCatchAsync(async() => await FImageCache.clearExpiredImage());
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(FExtensions.dateToYYYYMMdd(this.startDate), FExtensions.dateToYYYYMMdd(this.endDate)),
      e => this.fDialogService.error("getList", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }

  async refreshData(): Promise<void> {
    await this.getList();
  }
  async addEdi(): Promise<void> {
    await this.router.navigate([`/${FConstants.EDI_REQUEST_URL}`]);
  }
  async open(data: EDIUploadModel): Promise<void> {
    await this.router.navigate([`/${FConstants.EDI_LIST_URL}/${data.thisPK}`]);
  }
  async startDateChange(data: any): Promise<void> {
    if (this.startDate.getTime() > this.endDate.getTime()) {
      const buff = new Date(this.startDate);
      this.startDate = new Date(this.endDate);
      this.endDate = new Date(buff);
    }

    const diffDay = FExtensions.calcDateDiffDay(this.startDate, this.endDate);
    if (diffDay > 366) {
      this.endDate.setTime(this.startDate.getTime() + 365 * 1000 * 24 * 60 * 60);
      this.endCalendar.updateInputfield();
    }
  }
  async endDateChange(data: any): Promise<void> {
    if (this.startDate.getTime() > this.endDate.getTime()) {
      const buff = new Date(this.startDate);
      this.startDate = new Date(this.endDate);
      this.endDate = new Date(buff);
    }

    const diffDay = FExtensions.calcDateDiffDay(this.startDate, this.endDate);
    if (diffDay > 366) {
      this.startDate.setTime(this.endDate.getTime() - 365 * 1000 * 24 * 60 * 60);
      this.startCalendar.updateInputfield();
    }
  }

  get filterFields(): string[] {
    return ["orgName"];
  }
  get startDateTooltip(): string {
    return "edi-list.header.start-date";
  }
  get endDateTooltip(): string {
    return "edi-list.header.end-date";
  }
  getApplyDate(data: EDIUploadModel): string {
    return `${data.year}-${data.month}`;
  }

  protected readonly customSort = FExtensions.customSort;
  protected readonly filterTable = FExtensions.filterTable;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
  protected readonly StringToEDIStateDesc = StringToEDIStateDesc;
}

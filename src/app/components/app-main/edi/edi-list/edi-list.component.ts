import {Component, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import * as FImageCache from "../../../../guards/f-image-cache";
import {EdiListService} from "../../../../services/rest/edi-list.service";
import {Calendar} from "primeng/calendar";
import {StringToEDIStateDesc} from "../../../../models/rest/edi/edi-state";
import {EDIType} from "../../../../models/rest/edi/edi-type";
import {ExtraEDIListResponse} from "../../../../models/rest/edi/extra-edi-list-response";

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
  initValue: ExtraEDIListResponse[] = [];
  viewList: ExtraEDIListResponse[] = [];
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
      this.initValue.forEach(x => x.ediStateDesc = StringToEDIStateDesc[x.ediState]);
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
  async open(data: ExtraEDIListResponse): Promise<void> {
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
    return ["orgName", "ediStateDesc", "pharmaList.orgName"];
  }
  get startDateTooltip(): string {
    return "edi-list.header.start-date";
  }
  get endDateTooltip(): string {
    return "edi-list.header.end-date";
  }
  getApplyDate(data: ExtraEDIListResponse): string {
    return `${data.year}-${data.month}`;
  }
  getItemOrgName(item: ExtraEDIListResponse): string {
    if (item.ediType == EDIType.DEFAULT) {
      return item.orgName;
    }

    return `${item.orgName} (${item.tempOrgName})`
  }
  getItemPharmaName(item: ExtraEDIListResponse): string {
    if (item.pharmaList.length <= 0) {
      return "???";
    }
    if (item.pharmaList.length == 1) {
      return item.pharmaList[0];
    }
    return `${item.pharmaList[0]} (${item.pharmaList.length})`;
  }
  isPrimary(item: ExtraEDIListResponse): boolean {
    return this.isNewPlace(item) || this.isTransferPlace(item);
  }
  isNewPlace(item: ExtraEDIListResponse): boolean {
    return item.ediType == EDIType.NEW;
  }
  isTransferPlace(item: ExtraEDIListResponse): boolean {
    return item.ediType == EDIType.TRANSFER;
  }
  pharmaListTooltip(item: ExtraEDIListResponse): string {
    if (item.pharmaList.length <= 0) {
      return "";
    }
    let ret = "";
    item.pharmaList.forEach(x => ret += `${x}\n`);
    return ret;
  }

  get searchPlaceHolder(): string {
    return "common-desc.search";
  }

  protected readonly customSort = FExtensions.customSort;
  protected readonly filterTable = FExtensions.filterTable;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly getEDIStateSeverity = FExtensions.getEDIStateSeverity;
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
}

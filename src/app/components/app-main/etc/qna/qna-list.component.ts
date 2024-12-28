import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";
import {QnAHeaderModel} from "../../../../models/rest/qna/qna-header-model";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {QnaListService} from "../../../../services/rest/qna-list.service";
import {QnAStateToQnAStateDesc} from "../../../../models/rest/qna/qna-state";
import {getQnAStateSeverity} from "../../../../guards/f-extensions";

@Component({
  selector: "app-qna-list",
  templateUrl: "./qna-list.component.html",
  styleUrl: "./qna-list.component.scss",
  standalone: false,
})
export class QnaListComponent extends FComponentBase {
  isSorted: boolean | null = null;
  initValue: QnAHeaderModel[] = [];
  viewList: QnAHeaderModel[] = [];
  constructor(private thisService: QnaListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }

  override async ngInit(): Promise<void> {
    await this.getList();
  }
  async getList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(),
      e => this.fDialogService.error("getList", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.viewList = [...this.initValue];
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }
  async addQnA(): Promise<void> {
    await this.router.navigate([`${FConstants.QNA_WRITE_URL}`]);
  }
  async open(data: QnAHeaderModel): Promise<void> {
    if (this.configService.isNewTab()) {
      window.open(`${FConstants.QNA_LIST_URL}/${data.thisPK}`);
      return;
    }
    await this.router.navigate([`${FConstants.QNA_LIST_URL}/${data.thisPK}`]);
  }

  protected readonly customSort = FExtensions.customSort;
  protected readonly filterTable = FExtensions.filterTable;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly QnAStateToQnAStateDesc = QnAStateToQnAStateDesc;
  protected readonly getQnAStateSeverity = getQnAStateSeverity;
}

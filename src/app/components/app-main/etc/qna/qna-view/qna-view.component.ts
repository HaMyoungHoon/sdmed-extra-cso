import {Component} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {QnaListService} from "../../../../../services/rest/qna-list.service";
import {UserRole} from "../../../../../models/rest/user/user-role";
import {ActivatedRoute} from "@angular/router";
import {QnAHeaderModel} from "../../../../../models/rest/qna/qna-header-model";
import {QnAContentModel} from "../../../../../models/rest/qna/qna-content-model";
import * as FExtensions from "../../../../../guards/f-extensions";

@Component({
  selector: "app-qna-view",
  templateUrl: "./qna-view.component.html",
  styleUrl: "./qna-view.component.scss",
  standalone: false,
})
export class QnaViewComponent extends FComponentBase {
  thisPK: string = "";
  qnaHeaderModel: QnAHeaderModel = new QnAHeaderModel();
  qnaContentModel: QnAContentModel = new QnAContentModel();
  constructor(private thisService: QnaListService, private route: ActivatedRoute) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
    this.thisPK = this.route.snapshot.params["thisPK"];
  }

  override async ngInit(): Promise<void> {
    await this.getHeader();
  }

  async getHeader(): Promise<void> {
    if (this.thisPK == "") {
      return;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.getHeaderData(this.thisPK),
      e => this.fDialogService.error("getHeader", e));
    if (ret.result) {
      this.qnaHeaderModel = ret.data ?? new QnAHeaderModel();
      await this.getContent();
      return;
    }
    this.fDialogService.warn("getHeader", ret.msg);
  }
  async getContent(): Promise<void> {
    if (this.thisPK == "") {
      return;
    }
    const ret = await FExtensions.restTry(async() => await this.thisService.getContentData(this.thisPK),
      e => this.fDialogService.error("getContent", e));
    if (ret.result) {
      this.qnaContentModel = ret.data ?? new QnAContentModel();
      return;
    }
    this.fDialogService.warn("getContent", ret.msg);
  }
}

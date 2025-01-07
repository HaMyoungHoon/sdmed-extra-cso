import {Component, ElementRef, Inject, input, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {QnaListService} from "../../../../../services/rest/qna-list.service";
import {UserRole} from "../../../../../models/rest/user/user-role";
import {ActivatedRoute} from "@angular/router";
import {QnAHeaderModel} from "../../../../../models/rest/qna/qna-header-model";
import {QnAContentModel} from "../../../../../models/rest/qna/qna-content-model";
import * as FExtensions from "../../../../../guards/f-extensions";
import {transformToBoolean} from "primeng/utils";
import {QnAState, QnAStateToQnAStateDesc} from "../../../../../models/rest/qna/qna-state";
import {QnAFileModel} from "../../../../../models/rest/qna/qna-file-model";
import {saveAs} from "file-saver";
import {Editor, EditorTextChangeEvent} from "primeng/editor";
import {QnAReplyModel} from "../../../../../models/rest/qna/qna-reply-model";
import {UploadFileBuffModel} from "../../../../../models/common/upload-file-buff-model";
import {DOCUMENT} from "@angular/common";
import {ableFilename, restTry} from "../../../../../guards/f-extensions";
import * as FConstants from "../../../../../guards/f-constants";
import {QnAReplyFileModel} from "../../../../../models/rest/qna/qna-reply-file-model";

@Component({
  selector: "app-qna-view",
  templateUrl: "./qna-view.component.html",
  styleUrl: "./qna-view.component.scss",
  standalone: false,
})
export class QnaViewComponent extends FComponentBase {
  @ViewChild("quillEditor") quillEditor!: Editor;
  @ViewChild("inputFiles") inputFiles!: ElementRef<HTMLInputElement>;
  thisPK: string = "";
  qnaHeaderModel: QnAHeaderModel = new QnAHeaderModel();
  qnaContentModel: QnAContentModel = new QnAContentModel();
  qnaReplyModel: QnAReplyModel = new QnAReplyModel();
  accordionValue = ["0"];
  content: string = "";
  htmlValue: string = "";
  saveAble: boolean = false;
  uploadFileBuffModel: UploadFileBuffModel[] = [];
  activeIndex: number = 0;
  constructor(@Inject(DOCUMENT) private document: Document, private thisService: QnaListService, private route: ActivatedRoute) {
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
      this.accordionValue = [`${this.qnaContentModel.replyList.length - 1}`];
      return;
    }
    this.fDialogService.warn("getContent", ret.msg);
  }

  getBlobUrl(item: QnAFileModel): string {
    const ext = FExtensions.getExtMimeType(item.mimeType);
    if (FExtensions.isImage(ext)) {
      return item.blobUrl;
    }
    return FExtensions.extToBlobUrl(ext);
  }
  viewItem(data: QnAFileModel[], item: QnAFileModel): void {
    this.fDialogService.openFullscreenFileView({
      closable: false,
      closeOnEscape: true,
      maximizable: true,
      width: "100%",
      height: "100%",
      data: {
        file: FExtensions.qnaFileListToViewModel(data),
        index: data.findIndex(x => x.thisPK == item.thisPK)
      }
    });
  }
  viewReplyItem(data: QnAReplyFileModel[], item: QnAReplyFileModel): void {
    this.fDialogService.openFullscreenFileView({
      closable: false,
      closeOnEscape: true,
      maximizable: true,
      width: "100%",
      height: "100%",
      data: {
        file: FExtensions.qnaReplyFileListToViewModel(data),
        index: data.findIndex(x => x.thisPK == item.thisPK)
      }
    });
  }
  async downloadFile(item: QnAFileModel): Promise<void> {
    const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
      e => this.fDialogService.error("downloadFile", e));
    if (ret && ret.body) {
      saveAs(ret.body, FExtensions.ableFilename(item.originalFilename));
    }
  }
  async downloadReplyFile(item: QnAReplyFileModel): Promise<void> {
    const ret = await FExtensions.tryCatchAsync(async() => await this.commonService.downloadFile(item.blobUrl),
      e => this.fDialogService.error("downloadFile", e));
    if (ret && ret.body) {
      saveAs(ret.body, FExtensions.ableFilename(item.originalFilename));
    }
  }

  get canReply(): boolean {
    return this.qnaHeaderModel.qnaState == QnAState.Reply;
  }

  async saveReplyData(): Promise<void> {
    this.qnaReplyModel = new QnAReplyModel();
    this.qnaReplyModel.content = this.htmlValue;
    this.setLoading();
    let fileRet = await this.uploadAzure();
    if (!fileRet) {
      this.setLoading(false);
      return;
    }

    let uploadRet = await this.qnaUpload();
    if (!uploadRet) {
      this.setLoading(false);
      return;
    }
    this.uploadFileBuffModel.forEach(x => x.revokeBlob());

    this.setLoading(false);
  }
  async uploadAzure(): Promise<boolean> {
    if (this.thisPK.length <= 0) {
      return false;
    }

    let ret = true;
    for (const buff of this.uploadFileBuffModel) {
      const qnaFileModel = FExtensions.getQnAReplyPostFileModel(buff.file!!, this.thisPK, buff.ext, buff.mimeType);
      const sasKey = await FExtensions.restTry(async() => await this.commonService.getGenerateSas(qnaFileModel.blobName),
        e => this.fDialogService.error("saveData", e));
      if (!sasKey.result) {
        this.fDialogService.warn("saveData", sasKey.msg);
        ret = false;
        break;
      }
      await FExtensions.tryCatchAsync(async() => await this.azureBlobService.putUpload(buff.file!!, qnaFileModel.blobName, sasKey.data ?? "", qnaFileModel.mimeType),
        e => {
          this.fDialogService.error("saveData", e);
          ret = false;
        });
      if (!ret) {
        break;
      }
      this.qnaReplyModel.fileList.push(qnaFileModel);
    }

    return ret;
  }
  async qnaUpload(): Promise<boolean> {
    if (this.thisPK.length <= 0) {
      return false;
    }

    const ret = await FExtensions.restTry(async() => await this.thisService.postReply(this.thisPK, this.qnaReplyModel),
      e => this.fDialogService.error("saveData", e));
    if (ret.result) {
      await this.router.navigate([`/${FConstants.QNA_LIST_URL}`]);
      return true;
    }

    this.fDialogService.warn("saveData", ret.msg);
    return false;
  }


  quillOnInit(_: any): void {
    const quill = document.getElementById("quillEditor")?.getElementsByClassName("ql-image");
    if (quill == undefined || quill.length <= 0) {
      return;
    }
    quill[0].remove();
  }
  editorChange(data: EditorTextChangeEvent): void {
    this.htmlValue = data.htmlValue;
    this.checkSavable();
  }
  checkSavable(): void {
    if (this.htmlValue.length <= 0) {
      this.saveAble = false;
      return;
    }

    this.saveAble = true;
  }
  async fileUpload(): Promise<void> {
    this.inputFiles.nativeElement.click();
  }
  async completeQnA(): Promise<void> {
    const ret = await restTry(async() => await this.thisService.putData(this.thisPK),
      e => this.fDialogService.error("completeQnA", e));
    if (ret.result) {
      this.qnaHeaderModel = ret.data ?? new QnAHeaderModel();
      return;
    }
    return this.fDialogService.warn("completeQnA", ret.msg);
  }
  async fileSelected(data: Event): Promise<void> {
    const input = data.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setLoading();
      const gatheringFile = (await FExtensions.gatheringAbleFile(input.files, (file: File): void => {
        this.translateService.get("common-desc.not-supported-file").subscribe(x => {
          this.fDialogService.warn("fileUpload", `${file.name} ${x}`);
        });
      })).filter(x => !!x.file);
      if (gatheringFile.length > 0) {
        this.uploadFileBuffModel = this.uploadFileBuffModel.concat(gatheringFile);
        this.uploadFileBuffModel = FExtensions.distinctByFields(this.uploadFileBuffModel, ["file.name", "file.size"]);
      }
      this.inputFiles.nativeElement.value = "";
      this.checkSavable();

      this.setLoading(false);
    }
  }

  get acceptFiles(): string {
    return ".jpg,.jpeg,.png,.webp,.bmp,.xlsx,.pdf,.heif,.heic,.gif";
  }

  deleteUploadFile(data: UploadFileBuffModel): void {
    const index = this.uploadFileBuffModel.indexOf(data);
    if (index == this.uploadFileBuffModel.length - 1) {
      if (this.uploadFileBuffModel.length - 1 > 0) {
        this.activeIndex = this.uploadFileBuffModel.length - 2;
      } else {
        this.activeIndex = 0;
      }
    }

    if (index >= 0) {
      data.revokeBlob();
      this.uploadFileBuffModel.splice(index, 1);
    }
  }

  multipleEnable = input(true, { transform: (v: any) => transformToBoolean(v) });
  accordionIndex(item: QnAReplyModel): string {
    return `${this.qnaContentModel.replyList.findIndex(x => x.thisPK == item.thisPK)}`;
  }

  get downloadFileTooltip(): string {
    return "common-desc.save";
  }
  get removeFileTooltip(): string {
    return "common-desc.remove";
  }

  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly QnAStateToQnAStateDesc = QnAStateToQnAStateDesc;
  protected readonly getQnAStateSeverity = FExtensions.getQnAStateSeverity;
  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
}

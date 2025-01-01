import {Component, ElementRef, Inject, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../../guards/f-component-base";
import {UserRole} from "../../../../../models/rest/user/user-role";
import {QnaListService} from "../../../../../services/rest/qna-list.service";
import {Editor, EditorTextChangeEvent} from "primeng/editor";
import {DOCUMENT} from "@angular/common";
import * as FExtensions from "../../../../../guards/f-extensions";
import * as FConstants from "../../../../../guards/f-constants";
import {UploadFileBuffModel} from "../../../../../models/common/upload-file-buff-model";
import {QnAContentModel} from "../../../../../models/rest/qna/qna-content-model";

@Component({
  selector: "app-qna-write",
  templateUrl: "./qna-write.component.html",
  styleUrl: "./qna-write.component.scss",
  standalone: false,
})
export class QnaWriteComponent extends FComponentBase {
  @ViewChild("quillEditor") quillEditor!: Editor;
  @ViewChild("inputFiles") inputFiles!: ElementRef<HTMLInputElement>;
  qnaContentModel = new QnAContentModel();
  title: string = "";
  content: string = "";
  htmlValue: string = "";
  saveAble: boolean = false;
  uploadFileBuffModel: UploadFileBuffModel[] = [];
  activeIndex: number = 0;
  constructor(@Inject(DOCUMENT) private document: Document, private thisService: QnaListService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }

  override async ngInit(): Promise<void> {
  }

  async saveData(): Promise<void> {
    this.qnaContentModel = new QnAContentModel();
    this.qnaContentModel.content = this.htmlValue;
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
    this.router.navigate([`/${FConstants.QNA_LIST_URL}`]).then();
  }
  async uploadAzure(): Promise<boolean> {
    let ret = true;
    for (const buff of this.uploadFileBuffModel) {
      const qnaFileModel = FExtensions.getQnAPostFileModel(buff.file!!, buff.ext, buff.mimeType);
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
      this.qnaContentModel.fileList.push(qnaFileModel);
    }

    return ret;
  }
  async qnaUpload(): Promise<boolean> {
    const ret = await FExtensions.restTry(async() => await this.thisService.postData(this.title, this.qnaContentModel),
      e => this.fDialogService.error("saveData", e));
    if (ret.result) {
      return true;
    }

    this.fDialogService.warn("saveData", ret.msg);
    return false;
  }

  titleKeyDown(_: KeyboardEvent): void {
    this.checkSavable();
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
    if (this.title.length <= 0) {
      this.saveAble = false;
      return;
    }

    this.saveAble = true;
  }
  async fileUpload(): Promise<void> {
    this.inputFiles.nativeElement.click();
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
  get removeFileTooltip(): string {
    return "common-desc.remove";
  }

  protected readonly ellipsis = FExtensions.ellipsis;
  protected readonly galleriaContainerStyle = FConstants.galleriaContainerStyle;
}

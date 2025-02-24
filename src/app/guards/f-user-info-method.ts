import {RestResult} from "../models/common/rest-result";
import {UserDataModel} from "../models/rest/user/user-data-model";
import * as FExtensions from "./f-extensions";
import {MyInfoService} from "../services/rest/my-info.service";
import {CommonService} from "../services/rest/common.service";
import {AzureBlobService} from "../services/rest/azure-blob.service";
import {ElementRef} from "@angular/core";
import {FDialogService} from "../services/common/f-dialog.service";
import {stringArrayToUserRole, userRoleToFlag} from "../models/rest/user/user-role";
import {StatusDescToUserStatus} from "../models/rest/user/user-status";
import {UserFileModel} from "../models/rest/user/user-file-model";
import {UserFileType} from "../models/rest/user/user-file-type";
import {getUserBlobName} from "./f-extensions";

export async function imageSelected(event: any, data: UserDataModel, userFileType: UserFileType, service: MyInfoService, commonService: CommonService, azureBlobService: AzureBlobService): Promise<RestResult<UserFileModel>> {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const ext = await FExtensions.getFileExt(file);
    if (!FExtensions.isImage(ext)) {
      return new RestResult<UserFileModel>().setFail("only image file");
    }
    const blobName = FExtensions.getUserBlobName(data.id, ext);
    const blobStorageInfo = await commonService.getGenerateSas(blobName);
    if (blobStorageInfo.result != true || blobStorageInfo.data == undefined) {
      return new RestResult<UserFileModel>().setFail(blobStorageInfo.msg);
    }
    const blobModel = FExtensions.getUserBlobModel(file, blobStorageInfo.data, blobName, ext);
    await azureBlobService.putUpload(file, blobStorageInfo.data, blobModel.blobName, blobModel.mimeType);
    const ret = await service.putUserFileImageUrl(blobModel, userFileType);
    if (ret.result) {
      return ret;
    }
    return new RestResult<UserFileModel>().setFail(ret.msg);
  }

  return new RestResult<UserFileModel>().setFail("only image file");
}
export function userImageView(fileModel: UserFileModel | undefined, input: ElementRef<HTMLInputElement>, fDialogService: FDialogService): void {
  if (fileModel == undefined) {
    input.nativeElement.click();
    return;
  }
  fDialogService.openFullscreenFileView({
    closable: false,
    closeOnEscape: true,
    draggable: true,
    resizable: true,
    maximizable: true,
    data: {
      file: FExtensions.userFileListToViewModel(Array<UserFileModel>(fileModel!!)),
      index: 0
    }
  });
}

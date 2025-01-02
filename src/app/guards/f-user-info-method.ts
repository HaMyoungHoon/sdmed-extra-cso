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

export async function bankAccountImageSelected(event: any, data: UserDataModel, service: MyInfoService, commonService: CommonService, azureBlobService: AzureBlobService): Promise<RestResult<UserDataModel>> {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const ext = await FExtensions.getFileExt(file);
    if (!FExtensions.isImage(ext)) {
      return new RestResult<UserDataModel>().setFail("only image file");
    }
    const blobModel = FExtensions.getUserBlobModel(data.id, file, ext);
    const sasKey = await commonService.getGenerateSas(blobModel.blobName);
    if (sasKey.result != true) {
      return new RestResult<UserDataModel>().setFail(sasKey.msg);
    }
    await azureBlobService.putUpload(file, blobModel.blobName, sasKey.data ?? "", blobModel.mimeType);
    const ret = await service.putUserBankImageUrl(blobModel);
    if (ret.result) {
      return ret;
    }
    return new RestResult<UserDataModel>().setFail(ret.msg);
  }

  return new RestResult<UserDataModel>().setFail("only image file");
}

export async function taxpayerImageSelected(event: any, data: UserDataModel, service: MyInfoService, commonService: CommonService, azureBlobService: AzureBlobService): Promise<RestResult<UserDataModel>> {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const ext = await FExtensions.getFileExt(file);
    if (!FExtensions.isImage(ext)) {
      return new RestResult<UserDataModel>().setFail("only image file");
    }
    const blobModel = FExtensions.getUserBlobModel(data.id, file, ext);
    const sasKey = await commonService.getGenerateSas(blobModel.blobName);
    if (sasKey.result != true) {
      return new RestResult<UserDataModel>().setFail(sasKey.msg);
    }

    await azureBlobService.putUpload(file, blobModel.blobName, sasKey.data ?? "", blobModel.mimeType);
    const ret = await service.putUserTaxImageUrl(blobModel);
    if (ret.result) {
      return ret;
    }
    return new RestResult<UserDataModel>().setFail(ret.msg);
  }
  return new RestResult<UserDataModel>().setFail("only image file");
}

export function userImageView(dataUrl: string, input: ElementRef<HTMLInputElement>, fDialogService: FDialogService): void {
  if (dataUrl.length <= 0) {
    input.nativeElement.click();
    return;
  }
}

import { Injectable } from "@angular/core";
import {BlobHTTPHeaders, BlobServiceClient, BlockBlobUploadResponse} from "@azure/storage-blob";
import {BlobStorageInfoModel} from "../../models/rest/blob-storage-info-model";

@Injectable({
  providedIn: "root"
})
export class AzureBlobService {
  putUpload(file: File, blobStorageInfo: BlobStorageInfoModel | undefined, blobName: string, mimeType: string, onProgress?: (log: any) => void): Promise<BlockBlobUploadResponse> {
    if (blobStorageInfo == undefined) {
      throw new Error("can't upload file");
    }
    const blobServiceClient = new BlobServiceClient(`${blobStorageInfo.blobUrl}?${blobStorageInfo.sasKey}`);
    const containerClient = blobServiceClient.getContainerClient(blobStorageInfo.blobContainerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const blobHeader: BlobHTTPHeaders = { blobContentType: mimeType };
    return blobClient.upload(file, file.size, {
      onProgress: (log) => onProgress?.(log),
      blobHTTPHeaders: blobHeader
    });
  }
}

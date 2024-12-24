export class BlobUploadModel {
  blobUrl: string = "";
  blobName: string = "";
  uploaderPK: string = "";
  originalFilename: string = "";
  mimeType: string = "";

  builder(blobUrl: string = "", blobName: string, uploaderPK: string = "", originalFilename: string = "", mimeType: string = ""): BlobUploadModel {
    this.blobUrl = blobUrl;
    this.blobName = blobName;
    this.uploaderPK = uploaderPK;
    this.originalFilename = originalFilename;
    this.mimeType = mimeType;
    return this;
  }
}

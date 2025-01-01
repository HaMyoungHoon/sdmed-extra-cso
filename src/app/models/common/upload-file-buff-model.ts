export class UploadFileBuffModel {
  file?: File;
  filename: string = "";
  mimeType: string = "";
  blobUrl: string = "";
  ext: string = "";

  revokeBlob(): void {
    if (this.blobUrl.includes("blob://")) {
      URL.revokeObjectURL(this.blobUrl);
    }
    this.blobUrl = "";
  }
}

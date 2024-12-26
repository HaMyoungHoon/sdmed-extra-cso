import {RestResult} from "../models/common/rest-result";
import {SortEvent} from "primeng/api";
import {Table} from "primeng/table";
import * as FContentsType from "./f-contents-type";
import {EDIUploadFileModel} from "../models/rest/edi/edi-upload-file-model";
import * as FAmhohwa from "./f-amhohwa";
import * as FConstants from "./f-constants";
import {QnAFileModel} from "../models/rest/qna/qna-file-model";
import {QnAReplyFileModel} from "../models/rest/qna/qna-reply-file-model";
import {BlobUploadModel} from "../models/rest/blob-upload-model";

export function dToMon(date: Date): string {
  let ret = date.getMonth() + 1;
  return ret >= 10 ? `${ret}` : `0${ret}`;
}
export function dToD(date: Date): string {
  let ret = date.getDate();
  return ret >= 10 ? `${ret}` : `0${ret}`;
}
export function dToH(date: Date): string {
  let ret = date.getHours();
  return ret >= 10 ? `${ret}` : `0${ret}`;
}
export function dToMin(date: Date): string {
  let ret = date.getMinutes();
  return ret >= 10 ? `${ret}` : `0${ret}`;
}
export function dToS(date: Date): string {
  let ret = date.getSeconds();
  return ret >= 10 ? `${ret}` : `0${ret}`;
}
export function currentDateYYYYMMdd(): string {
  const date = new Date();

  return `${date.getFullYear()}${dToMon(date)}${dToD(date)}`;
}
export function dateToYearFullString(date?: Date): string {
  if (date == null) {
    return "????-??-?? ??:??:??";
  }

  return `${date.getFullYear()}-${dToMon(date)}-${dToD(date)} ${dToH(date)}:${dToMin(date)}:${dToS(date)}`;
}
export function dateToMonthFullString(date?: Date): string {
  if (date == null) {
    return "??-?? ??:??:??";
  }
  return `${dToMon(date)}-${dToD(date)} ${dToH(date)}:${dToMin(date)}:${dToS(date)}`;
}
export function dateToMonthYYYYMMdd(date?: Date | null): string {
  if (date == null) {
    return "????-??-??"
  }
  if (typeof(date) == "string") {
    date = stringToDate(date);
  }

  return `${date.getFullYear()}-${dToMon(date)}-${dToD(date)}`;
}
export function calcDateDiffDay(startDate: Date, endDate: Date): number {
  const diffMs = endDate.getTime() - startDate.getTime();
  const msToDay = 1000 * 60 * 60 * 24;
  return Math.floor(diffMs / msToDay);
}

export function stringToDate(dateString?: string): Date {
  if (dateString == null) {
    return new Date();
  }

  return new Date(dateString);
}
export function plusDays(targetDate: Date, days: number): Date {
  const ret = new Date(targetDate);
  ret.setDate(ret.getDate() + days);
  return ret;
}
export function plusMonths(targetDate: Date, months: number): Date {
  const ret = new Date(targetDate);
  ret.setMonth(ret.getMonth() + months);
  return ret;
}


export async function tryCatchAsync<T>(fn: () => Promise<T>, onError?: (e: any) => void): Promise<T | null> {
  try {
    return await fn();
  } catch (e: any) {
    if (onError) {
      onError(e.message);
    }
    return null;
  }
}
export async function restTry<T>(fn: () => Promise<RestResult<T>>, onError?: (e: any) => void): Promise<RestResult<T>> {
  try {
    return await fn();
  } catch (e: any) {
    if (onError) {
      const error = e.error as RestResult<T>;
      if (error) {
        return error;
      } else {
        onError(e.message);
      }
    }
    return new RestResult<T>().default
  }
}

export function applyClass<T>(classObj: { new (): T }, fn: (obj: T) => void): T {
  const ret = new classObj();
  fn(ret);
  return ret;
}
export function filterTable(table: Table, data: any, options: string): void {
  table.filterGlobal(data.target.value, options);
}

export function sortTableData(event: any): void {
  event.data.sort((data1: any[], data2: any[]) => {
    let value1 = data1[event.field];
    let value2 = data2[event.field];
    let result: number;
    if (value1 == null && value2 != null) result = -1;
    else if (value1 != null && value2 == null) result = 1;
    else if (value1 == null && value2 == null) result = 0;
    else if (typeof value1 === "string" && typeof value2 === "string") result = value1.localeCompare(value2);
    else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

    return event.order * result;
  });
}

export function customSort<T>(event: SortEvent, isSorted: boolean | null, table: Table, initValue: T[], viewValue: T[]): void {
  if (isSorted == null) {
    isSorted = true;
    sortTableData(event);
  } else if (isSorted) {
    isSorted = false;
    sortTableData(event);
  } else if (!isSorted) {
    isSorted = null;
    if (initValue) {
      viewValue = [...initValue];
    }
    table.reset();
  }
}

export function findIndexInList<T = any>(value: T, list: T[]): number {
  return list.indexOf(value)
}

export function ellipsis(data?: string, length: number = 20): string {
  if (data == null) {
    return "";
  }
  if (data.length > length) {
    return data.substring(0, length) + "...";
  }

  return data;
}

export function getUserBlobModel(file: File, ext: string): BlobUploadModel {
  const thisPK = FAmhohwa.getThisPK();
  const userID = FAmhohwa.getUserID();
  const blobName = `user/${userID}/${currentDateYYYYMMdd()}/${FAmhohwa.getRandomUUID()}.${ext}`;
  const blobUrl = `${FConstants.BLOB_URL}/${FConstants.BLOB_CONTAINER_NAME}/${blobName}`;
  return applyClass(BlobUploadModel, (obj) => {
    obj.blobUrl = blobUrl;
    obj.blobName = blobName;
    obj.uploaderPK = thisPK;
    obj.originalFilename = file.name;
    obj.mimeType = getMimeTypeExt(ext);
  });
}

export function getQnAPostFileModel(file: File, thisPK: string, ext: string): QnAFileModel {
  const userID = FAmhohwa.getUserID();
  const blobName = `qna/${userID}/${currentDateYYYYMMdd()}/${FAmhohwa.getRandomUUID()}.${ext}`;
  const blobUrl = `${FConstants.BLOB_URL}/${FConstants.BLOB_CONTAINER_NAME}/${blobName}`;
  return applyClass(QnAFileModel, (obj) => {
    obj.headerPK = thisPK;
    obj.blobUrl = blobUrl;
    obj.blobName = blobName;
    obj.originalFilename = file.name;
    obj.mimeType = getMimeTypeExt(ext);
  });
}

export function getQnAReplyPostFileModel(file: File, thisPK: string, ext: string): QnAReplyFileModel {
  const userName = FAmhohwa.getUserID();
  const blobName = `qna/${userName}/${currentDateYYYYMMdd()}/${FAmhohwa.getRandomUUID()}.${ext}`;
  const blobUrl = `${FConstants.BLOB_URL}/${FConstants.BLOB_CONTAINER_NAME}/${blobName}`;
  return applyClass(QnAReplyFileModel, (obj) => {
    obj.replyPK = thisPK;
    obj.blobUrl = blobUrl;
    obj.blobName = blobName;
    obj.originalFilename = file.name;
    obj.mimeType = getMimeTypeExt(ext);
  });
}

export function getEDIUploadFileModel(file: File, thisPK: string, ext: string): EDIUploadFileModel {
  const userName = FAmhohwa.getUserID();
  const blobName = `edi/${userName}/${currentDateYYYYMMdd()}/${FAmhohwa.getRandomUUID()}.${ext}`;
  const blobUrl = `${FConstants.BLOB_URL}/${FConstants.BLOB_CONTAINER_NAME}/${blobName}`;
  return applyClass(EDIUploadFileModel, (obj) => {
    obj.ediPK = thisPK;
    obj.blobUrl = blobUrl;
    obj.blobName = blobName;
    obj.originalFilename = file.name;
    obj.mimeType = getMimeTypeExt(ext);
  });
}

export function getFilenameExt(filename: string): string {
  const dotIndex = filename.indexOf(".") + 1;
  if (dotIndex <= 0 || dotIndex >= filename.length) {
    return "";
  }
  return filename.substring(dotIndex).toLowerCase();
}
export async function getFileExt(file: File, byteCount: number = 8): Promise<string> {
  const magicNumber = await getMagicNumber(file, byteCount);
  if (magicNumber.startsWith("50 4B 03 04")) return "zip";
  if (magicNumber.startsWith("50 4B 30 30 50 4B 03 04")) return "zip";
  if (magicNumber.startsWith("25 50 44 46")) return "pdf";
  if (magicNumber.startsWith("FF D8 FF")) return "jpeg";
  if (magicNumber.startsWith("89 50 4E 47")) return "png";
  if (magicNumber.startsWith("42 4D")) return "bmp";
  if (magicNumber.startsWith("52 49 46 46") && (await getMagicNumber(file, 12)).includes("57 45 42 50")) return "webp";
  if (magicNumber.startsWith("66 74 79 70 68 65 69 63")) return "heic";

  return "unknown";
}
export async function getMagicNumber(file: File, byteCount: number = 8): Promise<string> {
  let header = "";
  try {
    const arrayBuff = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuff.slice(0, byteCount))
    uint8Array.forEach(x => header += `${x.toString(16).padStart(2, "0")} `);
  } catch {
  }
  return header.toUpperCase();
}
export function isImage(ext: string): boolean {
  if (ext == "jpeg") return true;
  if (ext == "jpg") return true;
  if (ext == "png") return true;
  if (ext == "bmp") return true;
  if (ext == "webp") return true;
  if (ext == "heic") return true;

  return false;
}
export function getMimeTypeExt(ext: string): string {
  switch (ext) {
    case "aac": return FContentsType.type_aac;
    case "abw": return FContentsType.type_abw;
    case "arc": return FContentsType.type_arc;
    case "avi": return FContentsType.type_avi;
    case "azw": return FContentsType.type_azw;
    case "bin": return FContentsType.type_bin;
    case "bz": return FContentsType.type_bz;
    case "bz2": return FContentsType.type_bz2;
    case "csh": return FContentsType.type_csh;
    case "css": return FContentsType.type_css;
    case "csv": return FContentsType.type_csv;
    case "doc": return FContentsType.type_doc;
    case "epub": return FContentsType.type_epub;
    case "gif": return FContentsType.type_gif;
    case "htm": return FContentsType.type_htm;
    case "html": return FContentsType.type_html;
    case "heic": return FContentsType.type_heic;
    case "heif": return FContentsType.type_heif;
    case "ico": return FContentsType.type_ico;
    case "ics": return FContentsType.type_ics;
    case "jar": return FContentsType.type_jar;
    case "jpeg": return FContentsType.type_jpeg;
    case "jpg": return FContentsType.type_jpg;
    case "js": return FContentsType.type_js;
    case "json": return FContentsType.type_json;
    case "mid": return FContentsType.type_mid;
    case "midi": return FContentsType.type_midi;
    case "mpeg": return FContentsType.type_mpeg;
    case "mpkg": return FContentsType.type_mpkg;
    case "odp": return FContentsType.type_odp;
    case "ods": return FContentsType.type_ods;
    case "odt": return FContentsType.type_odt;
    case "oga": return FContentsType.type_oga;
    case "ogv": return FContentsType.type_ogv;
    case "ogx": return FContentsType.type_ogx;
    case "png": return FContentsType.type_png;
    case "pdf": return FContentsType.type_pdf;
    case "ppt": return FContentsType.type_ppt;
    case "rar": return FContentsType.type_rar;
    case "rtf": return FContentsType.type_rtf;
    case "sh": return FContentsType.type_sh;
    case "svg": return FContentsType.type_svg;
    case "swf": return FContentsType.type_swf;
    case "tar": return FContentsType.type_tar;
    case "tif": return FContentsType.type_tif;
    case "tiff": return FContentsType.type_tiff;
    case "ttf": return FContentsType.type_ttf;
    case "txt": return FContentsType.type_txt;
    case "vsd": return FContentsType.type_vsd;
    case "wav": return FContentsType.type_wav;
    case "weba": return FContentsType.type_weba;
    case "webm": return FContentsType.type_webm;
    case "webp": return FContentsType.type_webp;
    case "woff": return FContentsType.type_woff;
    case "xhtml": return FContentsType.type_xhtml;
    case "xls": return FContentsType.type_xls;
    case "xlsx": return FContentsType.type_xlsx;
    case "xlsm": return FContentsType.type_xlsm;
    case "xml": return FContentsType.type_xml;
    case "xul": return FContentsType.type_xul;
    case "zip": return FContentsType.type_zip;
    case "3gp": return FContentsType.type_3gp;
    case "3g2": return FContentsType.type_3g2;
    case "7z": return FContentsType.type_7z;
    default: return "";
  }
}

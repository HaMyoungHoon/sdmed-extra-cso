import * as CryptoJS from "crypto-js";
import {AUTH_TOKEN} from "./f-constants";

export let getLocalStorage = (key: string): string => {
  return decrypt(localStorage.getItem(key));
};
export let setLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, encrypt(value));
};
export let removeLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};
export let getSessionStorage = (key: string): string => {
  return decrypt(sessionStorage.getItem(key));
};
export let setSessionStorage = (key: string, value: string): void => {
  sessionStorage.setItem(key, encrypt(value));
};
export let removeSessionStorage = (key: string): void => {
  sessionStorage.removeItem(key);
};

export function encrypt(data : string | null): string {
  if (data == null) {
    return "";
  }
  return CryptoJS.AES.encrypt(data, AES_KEY).toString();
}
export function decrypt(data : string | null): string {
  if (data == null) {
    return "";
  }
  return CryptoJS.AES.decrypt(data, AES_KEY).toString(CryptoJS.enc.Utf8);
}
export function getRandomUUID(): string {
  return crypto.randomUUID()
}

const AES_KEY = "6574852065748520"
const toHexStr = (data: string) : string => {
  const dataLength = data.length;
  const bytes = new Array(dataLength);
  for (let i = 0; i < dataLength; ++i) {
    bytes[i] = data.charCodeAt(i).toString(16);
  }

  return bytes.toString();
};

const hexStrToByteArrayStr = (data: string | null) : string => {
  if (data == null) {
    return "";
  }

  let result = "";
  const split = data.split(",");
  const splitLength = split.length;
  for (let i = 0; i < splitLength; ++i) {
    result += (String.fromCharCode(parseInt(split[i], 16)));
  }

  return result;
};

export function getDateOrString(data: string | undefined): string {
  if (data == undefined) {
    return "";
  }

  if (!isNaN(Number(data)) && data.length == 12) {
    const yyyy = data.substring(0,4);
    const MM = data.substring(4,6);
    const dd = data.substring(6,8);
    return yyyy+"/"+MM+"/"+dd;
//    const hh = data.substr(8, 2);
//    const mm = data.substr(10, 2);
//    return yyyy+"/"+MM+"/"+dd+" "+hh+":"+mm;
  } else {
    return data;
  }
}
export let getViewTableCount: number[] = [20, 50, 100, 200];

export function isDateType(data: string): string {
  const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
  if (!data.match(regex)) {
    return new Date().toISOString().slice(0, 10);
  }

  const temp = new Date(data);
  if (!temp.getTime() && temp.getTime() != 0) {
    return new Date().toISOString().slice(0, 10);
  }

  return data;
}
export function toNumber(data: string): string {
  const regex = /\D/g;
  const regex2 = /\B(?=(\d{3})+(?!\d))/g;
  return data.replace(regex, "").replace(regex2, ",");
}

export function getTokenExpired(token: String): number {
  if (token.length <= 0) {
    return 0;
  }
  try {
    return (JSON.parse(atob(token.split(".")[1]))).exp ?? 0;
  } catch {
    return 0;
  }
}
export function getTokenExpiredDate(token: String): Date {
  let ret = new Date();
  ret.setTime(getTokenExpired(token) * 1000)
  return ret;
}
export function isExpired(token: string): boolean {
  const now = Math.floor(new Date().getTime() / 1000);
  const exp = getTokenExpired(token);
  return now > exp;
}
export function getThisPK(): string {
  const token = getLocalStorage(AUTH_TOKEN);
  return getTokenThisPK(token);
}
export function getUserID(): string {
  return getTokenID(getLocalStorage(AUTH_TOKEN));
}
export function getUserName(): string {
  return getTokenName(getLocalStorage(AUTH_TOKEN));
}
export function getTokenThisPK(token: string): string {
  if (token.length <= 0) {
    return "";
  }
  try {
    return (JSON.parse(atob(token.split(".")[1]))).index;
  } catch {
    return "";
  }
}
export function getTokenID(token: string): string {
  if (token.length <= 0) {
    return "";
  }
  try {
    return (JSON.parse(atob(token.split(".")[1]))).sub;
  } catch {
    return "";
  }
}

export function getTokenName(token: string): string {
  if (token.length <= 0) {
    return "";
  }
  try {
    return (JSON.parse(atob(token.split(".")[1]))).name;
  } catch {
    return "";
  }
}

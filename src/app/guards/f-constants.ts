export const AUTH_TOKEN: string = "token";

export const STORAGE_KEY_LANG: string = "lang";
export const STORAGE_IMAGE_CACHE_CLEAR_TIME: string = "imageCacheClearTime";
export const STORAGE_MULTI_LOGIN: string = "multiLogin";

export const HEADERS_CACHE_TIMESTAMP: string = "X-Cache-Timestamp";
export const CACHES_IMAGE_CACHE: string = "image-cache";

export const THEME_LINK: string = "app-theme";
export const MQTT_CONNECT_DATA: string = "mqtt-connect";
export const CALENDAR_VIEW_TYPE: string = "calendarViewType";

export const NOTFOUND_URL: string = "/notfound";
export const API_CSO: string = "/apiCSO";

export const DASH_BOARD_URL: string = "dashBoard";

export const EDI_REQUEST_URL: string = "ediRequest";
export const EDI_NEW_REQUEST_URL: string = "ediNewRequest";
export const EDI_LIST_URL: string = "ediList";
export const EDI_VIEW_URL: string = "ediList/:thisPK";
export const EDI_DUE_DATE_URL: string = "ediDueDate";

export const MY_INFO_URL: string = "myInfo";
export const MEDICINE_PRICE_LIST_URL: string = "medicine-price-list";
export const QNA_LIST_URL: string = "qnaList";
export const QNA_WRITE_URL: string = "qnaWrite";
export const QNA_VIEW_URL: string = "qnaList/:thisPK";

export const ANDROID_DOWNLOAD_LINK: string = "https://devsdmed1.blob.core.windows.net/devsdmed1/download/SD%20extra-CSO.apk";

export const ASSETS_NO_IMAGE: string = "assets/image/no-image-1920.png";
export const ASSETS_ZIP_IMAGE: string = "assets/image/zip-image.png";
export const ASSETS_PDF_IMAGE: string = "assets/image/pdf-image.png";
export const ASSETS_XLSX_IMAGE: string = "assets/image/excel-image.png";
export const ASSETS_DOCX_IMAGE: string = "assets/image/word-image.png";

export const tableStyle: {"min-width": string} = {"min-width": "20rem"};
export const filterTableOption: string = "contains";
export const galleriaContainerStyle: {"width": string, "height": string} = {"width": "300px", "height": "400px"};
export const galleriaContainerStyleWithThumbnail: {"width": string, "height": string} = {"width": "300px", "height": "400px"};

export const REGEX_CHECK_ID: RegExp = /^[A-Za-z0-9가-힣!@#$%^&*()/_\\-]{3,20}$/;
export const REGEX_CHECK_PASSWORD_0: RegExp = /^(?=.*[A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ])(?=.*[0-9]).{8,20}$/;
export const REGEX_CHECK_PASSWORD_1: RegExp = /^(?=.*[A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
export const REGEX_CHECK_PASSWORD_2: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

export const MAP_GOOGLE_API_KEY = "AIzaSyAcz6O5HVUam-TG_vuR7Hc6CNSuuvSiDsc";
export const MAP_GOOGLE_ID = "e3ab2c4c1d5bfc9a12de95c8 ";

export let DEF_LAT: number = 37.5020656;
export let DEF_LNG: number = 126.8880897;
export let DEF_POSITION = { lat: DEF_LAT, lng: DEF_LNG };

import { Injectable } from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {CommonService} from "../rest/common.service";
import * as FAmhohwa from "../../guards/f-amhohwa";
import {getKeyName, LangType} from "../../models/common/lang-type";
import * as FConstants from "../../guards/f-constants";
import * as FExtensions from "../../guards/f-extensions";
import {PrimeNG} from "primeng/config";

@Injectable({
  providedIn: "root"
})
export class LanguageService {
  langList: string[];

  constructor(private translateService: TranslateService, private commonService: CommonService, private primeNGConfig: PrimeNG) {
    this.langList = Object.keys(LangType);
  }
  async onInit(): Promise<void> {
    for (let lang of this.langList) {
      this.translateService.addLangs([lang])
    }

    const localLang: string = FAmhohwa.getLocalStorage(FConstants.STORAGE_KEY_LANG);
    let browserLang: string | undefined = "";
    let existLang: string | undefined = "";
    let matchingLang: string | undefined = "";
    if (localLang === "NaN" || localLang.length <= 0) {
      browserLang = this.translateService.getBrowserLang();
      existLang = this.langList.find(lang => browserLang == lang);
      matchingLang = existLang ? browserLang : "ko";
      matchingLang = matchingLang == undefined ? "ko" : matchingLang;
    } else {
      matchingLang = localLang;
    }

    this.translateService.setDefaultLang(matchingLang);
    this.translateService.use(matchingLang);
    await this.setLanguage(matchingLang);
  }
  async change(lang: LangType): Promise<void> {
    const existLang = this.langList.find(x => getKeyName(lang) == x);
    if (existLang) {
      this.translateService.use(existLang);
      await this.setLanguage(existLang);
    }
  }
  async setLanguage(lang: string): Promise<void> {
    this.translateService.get("primeng").subscribe(x => {
      this.primeNGConfig.setTranslation(x);
    })
    await FExtensions.restTry(async() => await this.commonService.setLanguage(lang));
    FAmhohwa.setLocalStorage(FConstants.STORAGE_KEY_LANG, lang);
  }

  isKoLang(): boolean {
    return FAmhohwa.getLocalStorage(FConstants.STORAGE_KEY_LANG) == "ko";
  }
}

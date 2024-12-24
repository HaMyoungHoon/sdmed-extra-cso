import {Injectable, Provider} from "@angular/core";
import {TranslateLoader, TranslateModule, TranslationObject} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {
  }

  getTranslation(lang: string): Observable<TranslationObject> {
    return this.http.get<Record<string, string>>(`/assets/i18n/${lang}.json`);
  }
}
export function provideTranslateLoader(): Provider[] {
  return [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: FTranslateLoader
      }
    }).providers!
  ];
}

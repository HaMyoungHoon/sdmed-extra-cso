import { Injectable } from "@angular/core";
import {HttpClient, HttpContext, HttpEvent, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {lastValueFrom, map, Observable} from "rxjs";
import {RestResult} from "../../models/common/rest-result";

@Injectable({
  providedIn: "root"
})
export class HttpResponseInterceptorService {
  options?: {
    headers?: HttpHeaders | { [ header: string ]: string | string[] },
    observe?: "body",
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: "json",
    withCredentials?: boolean,
  }
  blobOptions?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe: "response";
    context?: HttpContext;
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType: "blob";
    withCredentials?: boolean;
    transferCache?: {
      includeHeaders?: string[];
    } | boolean;
  }
  anyOptions?: {
    body?: any;
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    context?: HttpContext;
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    observe?: "body" | "events" | "response";
    reportProgress?: boolean;
    responseType?: "arraybuffer" | "blob" | "json" | "text";
    withCredentials?: boolean;
    transferCache?: {
      includeHeaders?: string[];
    } | boolean;
  }

  constructor(private http: HttpClient) {
    this.clear();
  }
  get<T = any>(url: string, options = this.options): Promise<RestResult<T>> {
    const ret = lastValueFrom(this.http.get<RestResult<T>>(url, options).pipe(
      map(response => response)
    ));
    this.clear();

    return ret;
  }
  post<T = any>(url: string, param?: any, options = this.options): Promise<RestResult<T>> {
    const ret = lastValueFrom(this.http.post<RestResult<T>>(url, param, options).pipe(
      map(response => response)
    ));
    this.clear();
    return ret;
  }
  put<T = any>(url: string, param?: any, options = this.options): Promise<RestResult<T>> {
    const ret = lastValueFrom(this.http.put<RestResult<T>>(url, param, options).pipe(
      map(response => response)
    ));
    this.clear();
    return ret;
  }
  delete<T = any>(url: string, options = this.options): Promise<RestResult<T>> {
    const ret = lastValueFrom(this.http.delete<RestResult<T>>(url, options).pipe(
      map(response => response)
    ));
    this.clear();
    return ret;
  }
  getBlob(url: string): Promise<HttpResponse<Blob>> {
    const ret = lastValueFrom(this.http.get(url, this.blobOptions!).pipe(
      map(response => response)
    ));
    this.clear();
    return ret;
  }
  requestAny(method: string, url: string): Observable<any> {
    return this.http.request(method, url, this.anyOptions)
  }
  getAny<T = any>(url: string, options?: {
    headers?: HttpHeaders | { [ header: string ]: string | string[] },
    observe?: "body",
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: "json",
    withCredentials?: boolean,
  }): Promise<any> {
    return lastValueFrom(this.http.get(url, options).pipe(
      map(response => response)
    ));
  }
  postAny<T = any>(url: string, param?: FormData): Promise<T> {
    return lastValueFrom(this.http.post<T>(url, param).pipe(
      map(response => response)
    ));
  }

  addParam(key: string, value: string | number | boolean): void {
    if (this.options!!.params === undefined) {
      this.options!!.params = new HttpParams()
    }

    this.options!!.params = this.options!!.params.append(key, value);
  }
  addBlobParam(key: string, value: string | number | boolean): void {
//    if (this.blobOptions!!.params === undefined) {
//      this.blobOptions!!.params = new HttpParams()
//    }
//
//    this.blobOptions!!.params = this.blobOptions!!.params.append(key, value);
  }
  setMultipartContentType(): void {
    this.options = {
      headers: new HttpHeaders({
      }),
    };
  }
  clear(): void {
    this.options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    this.blobOptions = {
      observe: "response",
      responseType: "blob"
    }
    this.anyOptions = {
      observe: "events",
      responseType: "blob",
      reportProgress: true
    }
  }
}

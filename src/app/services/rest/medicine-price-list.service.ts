import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {MedicineModel} from "../../models/rest/medicine/medicine-model";
import {MedicinePriceModel} from "../../models/rest/medicine/medicine-price-model";
import {ExtraMedicinePriceResponse} from "../../models/rest/medicine/extra-medicine-price-response";

@Injectable({
  providedIn: "root"
})
export class MedicinePriceListService {
  private baseUrl = "/apiCSO/extra/medicinePriceList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<ExtraMedicinePriceResponse[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
}

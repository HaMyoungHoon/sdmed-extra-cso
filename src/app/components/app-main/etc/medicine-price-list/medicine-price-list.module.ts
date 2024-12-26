import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicinePriceListComponent} from "./medicine-price-list.component";
import {MedicinePriceListRoutingModule} from "./medicine-price-list-routing.module";



@NgModule({
  declarations: [MedicinePriceListComponent],
  imports: [
    CommonModule, MedicinePriceListRoutingModule
  ]
})
export class MedicinePriceListModule { }

import { NgModule } from "@angular/core";
import {MedicinePriceListComponent} from "./medicine-price-list.component";
import {RouterModule} from "@angular/router";


@NgModule({
  imports: [RouterModule.forChild([{path: "", component: MedicinePriceListComponent}])],
  exports: [RouterModule]
})
export class MedicinePriceListRoutingModule { }

import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {EdiRequestComponent} from "./edi-request.component";



@NgModule({
  imports: [RouterModule.forChild([{path: "", component: EdiRequestComponent}])],
  exports: [RouterModule]
})
export class EdiRequestRoutingModule { }

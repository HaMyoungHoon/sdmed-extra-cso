import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {EdiViewComponent} from "./edi-view.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: EdiViewComponent}])],
  exports: [RouterModule]
})
export class EdiViewRoutingModule { }

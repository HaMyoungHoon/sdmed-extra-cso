import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {EdiNewRequestComponent} from "./edi-new-request.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: EdiNewRequestComponent}])],
  exports: [RouterModule]
})
export class EdiNewRequestRoutingModule { }

import { NgModule } from "@angular/core";
import {EdiDueDateComponent} from "./edi-due-date.component";
import {RouterModule} from "@angular/router";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: EdiDueDateComponent}])],
  exports: [RouterModule]
})
export class EdiDueDateRoutingModule { }

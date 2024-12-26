import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {EdiListComponent} from "./edi-list.component";



@NgModule({
  imports: [RouterModule.forChild([{path: "", component: EdiListComponent}])]
})
export class EdiListRoutingModule { }

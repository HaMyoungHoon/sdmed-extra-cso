import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiListComponent} from "./edi-list.component";
import {EdiListRoutingModule} from "./edi-list-routing.module";



@NgModule({
  declarations: [EdiListComponent],
  imports: [
    CommonModule, EdiListRoutingModule
  ]
})
export class EdiListModule { }

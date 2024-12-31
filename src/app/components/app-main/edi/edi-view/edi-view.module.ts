import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiViewComponent} from "./edi-view.component";
import {EdiViewRoutingModule} from "./edi-view-routing.module";



@NgModule({
  declarations: [EdiViewComponent],
  imports: [
    CommonModule, EdiViewRoutingModule
  ]
})
export class EdiViewModule { }

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiRequestComponent} from "./edi-request.component";
import {EdiRequestRoutingModule} from "./edi-request-routing.module";



@NgModule({
  declarations: [EdiRequestComponent],
  imports: [
    CommonModule, EdiRequestRoutingModule
  ]
})
export class EdiRequestModule { }

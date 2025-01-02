import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiDueDateComponent} from "./edi-due-date.component";
import {EdiDueDateRoutingModule} from "./edi-due-date-routing.module";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {FullCalendarModule} from "@fullcalendar/angular";



@NgModule({
  declarations: [EdiDueDateComponent],
  imports: [
    CommonModule, EdiDueDateRoutingModule, ProgressSpinComponent, FullCalendarModule
  ]
})
export class EdiDueDateModule { }

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {DashBoardComponent} from "./dash-board.component";
import {DashBoardRoutingModule} from "./dash-board-routing.module";
import {ProgressSpinComponent} from "../../common/progress-spin/progress-spin.component";
import {Button} from "primeng/button";
import {DatePicker} from "primeng/datepicker";
import {FormsModule} from "@angular/forms";
import {UIChart} from "primeng/chart";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [DashBoardComponent],
  imports: [
    CommonModule, DashBoardRoutingModule, ProgressSpinComponent, Button, DatePicker, FormsModule, UIChart, TableModule, Tag, TranslatePipe
  ]
})
export class DashBoardModule { }

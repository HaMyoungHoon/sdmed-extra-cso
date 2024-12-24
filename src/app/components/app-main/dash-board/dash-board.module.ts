import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {DashBoardComponent} from "./dash-board.component";
import {DashBoardRoutingModule} from "./dash-board-routing.module";



@NgModule({
  declarations: [DashBoardComponent],
  imports: [
    CommonModule, DashBoardRoutingModule
  ]
})
export class DashBoardModule { }

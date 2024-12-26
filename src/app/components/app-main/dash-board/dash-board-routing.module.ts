import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {DashBoardComponent} from "./dash-board.component";



@NgModule({
  imports: [RouterModule.forChild([{path: "", component: DashBoardComponent}])],
  exports: [RouterModule]
})
export class DashBoardRoutingModule { }

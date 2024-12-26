import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {MyInfoComponent} from "./my-info.component";



@NgModule({
  imports: [RouterModule.forChild([{path: "", component: MyInfoComponent}])],
  exports: [RouterModule]
})
export class MyInfoRoutingModule { }

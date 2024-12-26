import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MyInfoComponent} from "./my-info.component";
import {MyInfoRoutingModule} from "./my-info-routing.module";



@NgModule({
  declarations: [MyInfoComponent],
  imports: [
    CommonModule, MyInfoRoutingModule
  ]
})
export class MyInfoModule { }

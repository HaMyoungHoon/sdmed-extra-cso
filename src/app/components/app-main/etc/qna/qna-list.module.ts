import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {QnaListComponent} from "./qna-list.component";
import {QnaListRoutingModule} from "./qna-list-routing.module";



@NgModule({
  declarations: [QnaListComponent],
  imports: [
    CommonModule, QnaListRoutingModule
  ]
})
export class QnaListModule { }

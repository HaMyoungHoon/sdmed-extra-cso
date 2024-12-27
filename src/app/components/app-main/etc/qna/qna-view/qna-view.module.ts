import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {QnaViewComponent} from "./qna-view.component";
import {QnaViewRoutingModule} from "./qna-view-routing.module";



@NgModule({
  declarations: [QnaViewComponent],
  imports: [
    CommonModule, QnaViewRoutingModule
  ]
})
export class QnaViewModule { }

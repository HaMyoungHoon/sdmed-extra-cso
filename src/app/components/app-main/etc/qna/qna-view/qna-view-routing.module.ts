import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {QnaViewComponent} from "./qna-view.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: QnaViewComponent}])],
  exports: [RouterModule]
})
export class QnaViewRoutingModule { }

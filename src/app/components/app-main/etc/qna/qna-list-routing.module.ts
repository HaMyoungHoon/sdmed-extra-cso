import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {QnaListComponent} from "./qna-list.component";



@NgModule({
  imports: [RouterModule.forChild([{path: "", component: QnaListComponent}])],
  exports: [RouterModule]
})
export class QnaListRoutingModule { }

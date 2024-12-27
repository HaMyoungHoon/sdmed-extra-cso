import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {QnaWriteComponent} from "./qna-write.component";



@NgModule({
  imports: [RouterModule.forChild([{path:"", component: QnaWriteComponent}])],
  exports: [RouterModule]
})
export class QnaWriteRoutingModule { }

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {QnaListComponent} from "./qna-list.component";
import {QnaListRoutingModule} from "./qna-list-routing.module";
import {TableModule} from "primeng/table";
import {InputText} from "primeng/inputtext";
import {InputIcon} from "primeng/inputicon";
import {IconField} from "primeng/iconfield";
import {TranslatePipe} from "@ngx-translate/core";
import {Button} from "primeng/button";
import {Tag} from "primeng/tag";



@NgModule({
  declarations: [QnaListComponent],
  imports: [
    CommonModule, QnaListRoutingModule, TableModule, InputText, InputIcon, IconField, TranslatePipe, Button, Tag
  ]
})
export class QnaListModule { }

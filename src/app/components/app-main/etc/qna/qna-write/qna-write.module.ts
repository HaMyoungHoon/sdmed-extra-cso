import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {QnaWriteComponent} from "./qna-write.component";
import {QnaWriteRoutingModule} from "./qna-write-routing.module";
import {TranslatePipe} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {Editor} from "primeng/editor";
import {Button} from "primeng/button";
import {GalleriaModule} from "primeng/galleria";
import {Image} from "primeng/image";
import {Card} from "primeng/card";
import {Tooltip} from "primeng/tooltip";
import {ProgressSpinComponent} from "../../../../common/progress-spin/progress-spin.component";



@NgModule({
  declarations: [QnaWriteComponent],
  imports: [
    CommonModule, QnaWriteRoutingModule, TranslatePipe, FormsModule, FloatLabel, InputText, Editor, Button, GalleriaModule, Image, Card, Tooltip, ProgressSpinComponent
  ]
})
export class QnaWriteModule { }

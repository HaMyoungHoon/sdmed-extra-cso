import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiNewRequestComponent} from "./edi-new-request.component";
import {EdiNewRequestRoutingModule} from "./edi-new-request-routing.module";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {Listbox} from "primeng/listbox";
import {TranslatePipe} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {GalleriaModule} from "primeng/galleria";
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import {InputText} from "primeng/inputtext";
import {IftaLabel} from "primeng/iftalabel";
import {Select} from "primeng/select";
import {
  EdiPharmaFileCombineModelComponent
} from "../../../common/edi-pharma-file-combine-model/edi-pharma-file-combine-model.component";



@NgModule({
  declarations: [EdiNewRequestComponent],
  imports: [
    CommonModule, EdiNewRequestRoutingModule, ProgressSpinComponent, Listbox, TranslatePipe, FormsModule, GalleriaModule, Button, Tooltip, InputText, IftaLabel, Select, EdiPharmaFileCombineModelComponent
  ]
})
export class EdiNewRequestModule { }

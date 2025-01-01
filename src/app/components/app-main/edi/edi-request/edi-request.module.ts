import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiRequestComponent} from "./edi-request.component";
import {EdiRequestRoutingModule} from "./edi-request-routing.module";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {Listbox} from "primeng/listbox";
import {FormsModule} from "@angular/forms";
import {PrimeTemplate} from "primeng/api";
import {TranslatePipe} from "@ngx-translate/core";
import {Button} from "primeng/button";
import {GalleriaModule} from "primeng/galleria";
import {Tooltip} from "primeng/tooltip";
import {Select} from "primeng/select";



@NgModule({
  declarations: [EdiRequestComponent],
  imports: [
    CommonModule, EdiRequestRoutingModule, ProgressSpinComponent, Listbox, FormsModule, PrimeTemplate, TranslatePipe, Button, GalleriaModule, Tooltip, Select
  ]
})
export class EdiRequestModule { }

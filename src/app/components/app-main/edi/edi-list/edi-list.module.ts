import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiListComponent} from "./edi-list.component";
import {EdiListRoutingModule} from "./edi-list-routing.module";
import {Button} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePicker} from "primeng/datepicker";
import {FormsModule} from "@angular/forms";
import {Tooltip} from "primeng/tooltip";



@NgModule({
  declarations: [EdiListComponent],
  imports: [
    CommonModule, EdiListRoutingModule, Button, IconField, InputIcon, InputText, TableModule, Tag, TranslatePipe, DatePicker, FormsModule, Tooltip
  ]
})
export class EdiListModule { }

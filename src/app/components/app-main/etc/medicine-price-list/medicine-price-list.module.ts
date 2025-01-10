import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MedicinePriceListComponent} from "./medicine-price-list.component";
import {MedicinePriceListRoutingModule} from "./medicine-price-list-routing.module";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {TranslatePipe} from "@ngx-translate/core";
import {InputText} from "primeng/inputtext";



@NgModule({
  declarations: [MedicinePriceListComponent],
  imports: [
    CommonModule, MedicinePriceListRoutingModule, TableModule, Button, IconField, InputIcon, TranslatePipe, InputText
  ]
})
export class MedicinePriceListModule { }

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {NotFoundComponent} from "./not-found.component";
import {NotFoundRoutingModule} from "./not-found-routing.module";
import {TranslatePipe} from "@ngx-translate/core";
import {Button} from "primeng/button";



@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule, NotFoundRoutingModule, TranslatePipe, Button
  ]
})
export class NotFoundModule { }

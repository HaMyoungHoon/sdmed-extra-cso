import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MyInfoComponent} from "./my-info.component";
import {MyInfoRoutingModule} from "./my-info-routing.module";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Button} from "primeng/button";
import {TableModule} from "primeng/table";
import {TranslatePipe} from "@ngx-translate/core";
import {Tag} from "primeng/tag";
import {Image} from "primeng/image";
import {Divider} from "primeng/divider";
import {Popover} from "primeng/popover";
import {UserTrainingFileAddComponent} from "../../../common/user-training-file-add/user-training-file-add.component";



@NgModule({
  declarations: [MyInfoComponent],
  imports: [
    CommonModule, MyInfoRoutingModule, ProgressSpinComponent, Accordion, AccordionPanel, AccordionHeader, AccordionContent, Button, TableModule, TranslatePipe, Tag, Image, Divider, Popover, UserTrainingFileAddComponent
  ]
})
export class MyInfoModule { }

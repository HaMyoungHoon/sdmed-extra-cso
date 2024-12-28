import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {QnaViewComponent} from "./qna-view.component";
import {QnaViewRoutingModule} from "./qna-view-routing.module";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {TranslatePipe} from "@ngx-translate/core";
import {Card} from "primeng/card";
import {SafeHtmlPipe} from "../../../../../guards/safe-html.pipe";
import {GalleriaModule} from "primeng/galleria";
import {Button} from "primeng/button";
import {Image} from "primeng/image";
import {Tooltip} from "primeng/tooltip";
import {Tag} from "primeng/tag";



@NgModule({
  declarations: [QnaViewComponent],
  imports: [
    CommonModule, QnaViewRoutingModule, Accordion, AccordionPanel, AccordionHeader, AccordionContent, TranslatePipe, Card, SafeHtmlPipe, GalleriaModule, Button, Image, Tooltip, Tag
  ]
})
export class QnaViewModule { }

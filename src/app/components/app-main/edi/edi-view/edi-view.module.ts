import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {EdiViewComponent} from "./edi-view.component";
import {EdiViewRoutingModule} from "./edi-view-routing.module";
import {TranslatePipe} from "@ngx-translate/core";
import {GalleriaModule} from "primeng/galleria";
import {ProgressSpinComponent} from "../../../common/progress-spin/progress-spin.component";
import {Tag} from "primeng/tag";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Select} from "primeng/select";
import {FormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import {Image} from "primeng/image";
import {Textarea} from "primeng/textarea";
import {ConfirmPopup} from "primeng/confirmpopup";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {
	EdiPharmaFileViewModelComponent
} from "../../../common/edi-pharma-file-view-model/edi-pharma-file-view-model.component";



@NgModule({
  declarations: [EdiViewComponent],
	imports: [
		CommonModule, EdiViewRoutingModule, TranslatePipe, GalleriaModule, ProgressSpinComponent, Tag, Accordion, AccordionPanel, AccordionHeader, Select, FormsModule, AccordionContent, TableModule, Button, Tooltip, Image, Textarea, ConfirmPopup, IftaLabel, InputText, EdiPharmaFileViewModelComponent
	]
})
export class EdiViewModule { }

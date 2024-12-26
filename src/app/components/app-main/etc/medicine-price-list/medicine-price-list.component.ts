import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";

@Component({
  selector: "app-medicine-price-list",
  templateUrl: "./medicine-price-list.component.html",
  styleUrl: "./medicine-price-list.component.scss",
  standalone: false,
})
export class MedicinePriceListComponent extends FComponentBase {
  constructor() {
    super();
  }
}

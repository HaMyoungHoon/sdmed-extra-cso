import {Component, Input} from "@angular/core";
import {NgIf} from "@angular/common";
import {ProgressSpinner} from "primeng/progressspinner";

@Component({
  selector: "app-progress-spin",
  imports: [
    NgIf,
    ProgressSpinner
  ],
  templateUrl: "./progress-spin.component.html",
  styleUrl: "./progress-spin.component.scss",
  standalone: true,
})
export class ProgressSpinComponent {
  @Input() isLoading: boolean = false;
  constructor() {
  }
}

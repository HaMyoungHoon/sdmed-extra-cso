import { Component } from "@angular/core";
import {Router, RouterOutlet} from "@angular/router";
import {Toast} from "primeng/toast";
import {LanguageService} from "./services/common/language.service";
import {TranslatePipe} from "@ngx-translate/core";
import {StyleClass} from "primeng/styleclass";
import {Button} from "primeng/button";
import {NgIf} from "@angular/common";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Toast, TranslatePipe, StyleClass, Button, NgIf],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent {
  constructor(public languageService: LanguageService, public router: Router) {
    languageService.onInit().then();
  }
}

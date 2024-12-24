import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import {Toast} from "primeng/toast";
import {LanguageService} from "./services/common/language.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Toast],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent {
  constructor(public languageService: LanguageService) {
    languageService.onInit().then();
  }
}

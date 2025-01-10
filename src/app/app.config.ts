import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import {provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling} from "@angular/router";

import { routes } from "./app.routes";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {HttpRequestInterceptorService} from "./services/common/http-request-interceptor.service";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {ConfirmationService, MessageService} from "primeng/api";
import {FDialogService} from "./services/common/f-dialog.service";
import {DialogService} from "primeng/dynamicdialog";
import {provideTranslateLoader} from "./guards/f-translate-loader";
import {providePrimeNG} from "primeng/config";
import Noir from "./app-theme"

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([HttpRequestInterceptorService])
    ),
    provideTranslateLoader(),
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withInMemoryScrolling({
        anchorScrolling: "enabled",
        scrollPositionRestoration: "enabled"
      }),
      withEnabledBlockingInitialNavigation()
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: Noir
    }),
    ConfirmationService,
    MessageService,
    FDialogService,
    DialogService
  ]
};

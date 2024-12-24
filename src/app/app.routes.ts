import { Routes } from "@angular/router";
import {AppMainComponent} from "./components/app-main/app-main.component";
import * as FConstants from "./guards/f-constants";

export const routes: Routes = [
  { path: "", component: AppMainComponent,
    children: [
      { path: FConstants.DASH_BOARD_URL, loadChildren: () => import("./components/app-main/dash-board/dash-board.module").then(m => m.DashBoardModule) },
    ]
  },
  { path: FConstants.NOTFOUND_URL.slice(1), loadChildren: () => import("./components/not-found/not-found.module").then(m => m.NotFoundModule) },
  { path: FConstants.API_CSO.slice(1), loadChildren: () => import("./components/not-found/not-found.module").then(m => m.NotFoundModule) },
  { path: "**", redirectTo: FConstants.NOTFOUND_URL },
];

import { Routes } from "@angular/router";
import {AppMainComponent} from "./components/app-main/app-main.component";
import * as FConstants from "./guards/f-constants";

export const routes: Routes = [
  { path: "", component: AppMainComponent,
    children: [
      { path: FConstants.DASH_BOARD_URL, loadChildren: () => import("./components/app-main/dash-board/dash-board.module").then(m => m.DashBoardModule) },

      { path: FConstants.EDI_REQUEST, loadChildren: () => import("./components/app-main/edi/edi-request/edi-request.module").then(m => m.EdiRequestModule) },
      { path: FConstants.EDI_LIST, loadChildren: () => import("./components/app-main/edi/edi-list/edi-list.module").then(m => m.EdiListModule) },

      { path: FConstants.MY_INFO_URL, loadChildren: () => import("./components/app-main/etc/my-info/my-info.module").then(m => m.MyInfoModule) },
      { path: FConstants.MEDICINE_PRICE_LIST_URL, loadChildren: () => import("./components/app-main/etc/medicine-price-list/medicine-price-list.module").then(m => m.MedicinePriceListModule) },
      { path: FConstants.QNA_LIST_URL, loadChildren: () => import("./components/app-main/etc/qna/qna-list.module").then(m => m.QnaListModule) },
    ]
  },
  { path: FConstants.NOTFOUND_URL.slice(1), loadChildren: () => import("./components/not-found/not-found.module").then(m => m.NotFoundModule) },
  { path: FConstants.API_CSO.slice(1), loadChildren: () => import("./components/not-found/not-found.module").then(m => m.NotFoundModule) },
  { path: "**", redirectTo: FConstants.NOTFOUND_URL },
];

import {MenuItem} from "primeng/api";
import * as FConstants from "../../../guards/f-constants";

export function MenuItem1(): MenuItem {
  return {
    label: "menu-1.title",
    styleClass: "top-menu",
    items: [
      {
        label: "menu-1.sub-menu.sub-1",
        icon: "pi pi-fw pi-home",
        styleClass: "top-menu",
        routerLink: `/${FConstants.DASH_BOARD_URL}`,
      }
    ]
  };
}

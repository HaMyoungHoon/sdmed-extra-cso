import {MenuItem} from "primeng/api";
import * as FConstants from "../../../guards/f-constants";

export function MenuItem2(): MenuItem {
  return {
    label: "menu-2.title",
    styleClass: "top-menu",
    items: [
      {
        label: "menu-2.sub-menu.sub-1",
        icon: "pi pi-fw pi-cloud-upload",
        styleClass: "top-menu",
        routerLink: `/${FConstants.EDI_REQUEST_URL}`,
      },
      {
        label: "menu-2.sub-menu.sub-2",
        icon: "pi pi-fw pi-list-check",
        styleClass: "top-menu",
        routerLink: `/${FConstants.EDI_LIST_URL}`,
      },
      {
        label: "menu-2.sub-menu.sub-3",
        icon: "pi pi-fw pi-calendar",
        styleClass:"top-menu",
        routerLink: `/${FConstants.EDI_DUE_DATE_URL}`,
      }
    ]
  };
}

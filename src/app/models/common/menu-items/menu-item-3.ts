import {MenuItem} from "primeng/api";
import * as FConstants from "../../../guards/f-constants";

export function MenuItem3(): MenuItem {
  return {
    label: "menu-3.title",
    styleClass: "top-menu",
    items: [
      {
        label: "menu-3.sub-menu.sub-1",
        icon: "pi pi-fw pi-user",
        styleClass: "top-menu",
        routerLink: `/${FConstants.MY_INFO_URL}`,
      },
      {
        label: "menu-3.sub-menu.sub-2",
        "path": "M440-200h80v-40h40q17 0 28.5-11.5T600-280v-120q0-17-11.5-28.5T560-440H440v-40h160v-80h-80v-40h-80v40h-40q-17 0-28.5 11.5T360-520v120q0 17 11.5 28.5T400-360h120v40H360v80h80v40ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-560v-160H240v640h480v-480H520ZM240-800v160-160 640-640Z",
        "viewBox": "0 -900 900 900",
        "height": "18px",
        "width": "18px",
        routerLink: `/${FConstants.MEDICINE_PRICE_LIST_URL}`,
      },
      {
        label: "menu-3.sub-menu.sub-3",
        icon: "pi pi-fw pi-question",
        styleClass: "top-menu",
        routerLink: `/${FConstants.QNA_LIST_URL}`,
      },
    ]
  };
}

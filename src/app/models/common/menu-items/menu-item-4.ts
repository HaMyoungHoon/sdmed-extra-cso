import {MenuItem} from "primeng/api";
import * as FConstants from "../../../guards/f-constants";

export function MenuItem4(): MenuItem {
  return {
    label: "menu-4.title",
    styleClass: "top-menu",
    items: [
      {
        label: "menu-4.sub-menu.sub-1",
        icon: "pi pi-fw pi-android",
        styleClass: "top-menu",
        url: `${FConstants.ANDROID_DOWNLOAD_LINK}`,
      },
    ]
  };
}

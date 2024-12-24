import {MenuItem} from "primeng/api";
import {MenuItem1} from "./menu-items/menu-item-1";

export function MainMenuItem(): MenuItem[] {
  const ret: MenuItem[] = [];
  ret.push(MenuItem1());
  return ret;
}

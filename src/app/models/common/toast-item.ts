import {ToastLevel} from "./toast-level";

export interface ToastItem {
  level: ToastLevel;
  title: string;
  detail?: string;
}

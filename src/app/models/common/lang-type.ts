export enum LangType {
  "ko" = "한국어",
  "en" = "English"
}
export function getKeyName(value: LangType): string | undefined {
  return Object.entries(LangType).find(([key, val]) => val === value)?.[0];
}

import {computed, effect, inject, Injectable, PLATFORM_ID, signal} from "@angular/core";
import * as FConstants from "../../guards/f-constants";
import * as FAmhohwa from "../../guards/f-amhohwa";
import {AppState} from "../../models/common/app-state";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class AppConfigService {
  appState = signal<AppState>({
    isNewTab: false,
    scale: 14
  });
  document = inject(DOCUMENT);
  platformId = inject(PLATFORM_ID);
  theme = computed(() => (this.appState()?.darkTheme ? "dark" : "light"));
  transitionComplete = signal<boolean>(false);
  private initialized = false;
  constructor() {
    this.appState.set({ ...this.loadAppState() });

    effect(
      () => {
        const state = this.appState();
        this.saveAppState(state);
        this.handleDarkModeTransition(state);
      },
      { }
    );
  }


  hideMenu() {
    this.appState.update((state) => ({
      ...state,
      menuActive: false
    }));
  }

  showMenu() {
    this.appState.update((state) => ({
      ...state,
      menuActive: true
    }));
  }

  toggleDarkMode(toDark: boolean): void {
    this.appState.update((state) => ({
      ...state,
      darkTheme: toDark
    }));
  }
  changeScale(scale: number): void {
    this.appState.update((state) => ({
      ...state,
      scale: scale
    }));
  }
  changeNewTab(isNewTab: boolean): void {
    this.appState.update((state) => ({
      ...state,
      isNewTab: isNewTab
    }));
  }
  isDarkMode = computed(() => this.appState().darkTheme ?? false);
  isMenuActive = computed(() => this.appState().menuActive ?? false);
  isNewTab = computed(() => this.appState().isNewTab ?? false);
  getScale = computed(() => this.appState().scale ?? 14);


  private onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }
  private handleDarkModeTransition(state: AppState): void {
    if (isPlatformBrowser(this.platformId)) {
      if ((document as any).startViewTransition) {
        this.scaled(state);
        this.startViewTransition(state);
      } else {
        this.toggledDarkMode(state);
        this.onTransitionEnd();
      }
    }
  }
  private startViewTransition(state: AppState): void {
    const transition = (document as any).startViewTransition(() => {
      this.toggledDarkMode(state);
    });
    transition.ready.then(() => this.onTransitionEnd());
  }
  private toggledDarkMode(state: AppState): void {
    if (state.darkTheme) {
      this.document.documentElement.classList.add("p-dark");
    } else {
      this.document.documentElement.classList.remove("p-dark");
    }
  }
  private scaled(state: AppState): void {
    this.document.documentElement.style.fontSize = `${state.scale}px`;
  }
  private loadAppState(): AppState {
    if (isPlatformBrowser(this.platformId)) {
      const storedState = FAmhohwa.getLocalStorage(FConstants.THEME_LINK);
      if (storedState.length > 0) {
        return JSON.parse(storedState);
      }
    }
    return {
      preset: "Aura",
      primary: "noir",
      surface: undefined,
      darkTheme: false,
      menuActive: false,
      isNewTab: false,
      scale: 14,
    };
  }

  private saveAppState(state: any): void {
    if (isPlatformBrowser(this.platformId)) {
      FAmhohwa.setLocalStorage(FConstants.THEME_LINK, JSON.stringify(state));
    }
  }

  getCalendarViewType(): string {
    const buff = FAmhohwa.getLocalStorage(FConstants.CALENDAR_VIEW_TYPE);
    if (buff.length <= 0) {
      return "dayGridMonth"
    }
    return buff;
  }
  setCalendarViewType(typeString: string): void {
    FAmhohwa.setLocalStorage(FConstants.CALENDAR_VIEW_TYPE, typeString);
  }
}

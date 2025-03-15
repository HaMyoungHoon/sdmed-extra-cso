import {computed, effect, inject, Injectable, PLATFORM_ID, signal} from "@angular/core";
import * as FConstants from "../../guards/f-constants";
import * as FAmhohwa from "../../guards/f-amhohwa";
import {AppState} from "../../models/common/app-state";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {UserMultiLoginModel} from "../../models/rest/user/user-multi-login-model";

@Injectable({
  providedIn: "root"
})
export class AppConfigService {
  appState = signal<AppState>({
    isNewTab: false,
    scale: 14
  });
  multiLogin: UserMultiLoginModel[] = [];
  document = inject(DOCUMENT);
  platformId = inject(PLATFORM_ID);
  theme = computed(() => (this.appState()?.darkTheme ? "dark" : "light"));
  transitionComplete = signal<boolean>(false);
  private initialized = false;
  constructor() {
    this.appState.set({ ...this.loadAppState() });
    this.multiLogin = this.loadMultiLogin();
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
  getLoginData = computed(() => this.multiLogin ?? []);

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
  private loadMultiLogin(): UserMultiLoginModel[] {
    const ret: UserMultiLoginModel[] = [];
    const storedState = FAmhohwa.getLocalStorage(FConstants.STORAGE_MULTI_LOGIN);
    if (storedState.length > 0) {
      const buff = JSON.parse(storedState) as UserMultiLoginModel[];
      buff.forEach(x => ret.push(x));
    }
    return ret;
  }

  private saveAppState(state: any): void {
    if (isPlatformBrowser(this.platformId)) {
      FAmhohwa.setLocalStorage(FConstants.THEME_LINK, JSON.stringify(state));
    }
  }
  private saveMultiLogin(data: UserMultiLoginModel[]): void {
    FAmhohwa.setLocalStorage(FConstants.STORAGE_MULTI_LOGIN, JSON.stringify(data));
    this.multiLogin = data;
  }
  addMultiLogin(data: UserMultiLoginModel): void {
    let currentData = this.getLoginData() as UserMultiLoginModel[];
    if (currentData.length == undefined) {
      currentData = [];
    }
    currentData.forEach(x => x.isLogin = false);
    const buff = currentData.findIndex(x => x.thisPK == data.thisPK);
    if (buff == -1) {
      currentData.push(data);
    } else {
      currentData[buff].thisPK = data.thisPK;
      currentData[buff].id = data.id;
      currentData[buff].name = data.name;
      currentData[buff].token = data.token;
      currentData[buff].isLogin = data.isLogin;
    }
    this.saveMultiLogin(currentData);
  }
  removeMultiLogin(data: UserMultiLoginModel): void {
    const currentData = this.getLoginData().filter(x => x.thisPK != data.thisPK);
    this.saveMultiLogin(currentData);
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

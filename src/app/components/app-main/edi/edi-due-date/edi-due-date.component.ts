import {ChangeDetectorRef, Component, signal, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {EDIPharmaDueDateModel} from "../../../../models/rest/edi/edi-pharma-due-date-model";
import {CalendarOptions, DatesSetArg, EventApi} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {UserRole} from "../../../../models/rest/user/user-role";
import {Subject, takeUntil} from "rxjs";
import {LangChangeEvent} from "@ngx-translate/core";
import * as FExtensions from "../../../../guards/f-extensions";
import {EdiDueDateService} from "../../../../services/rest/edi-due-date.service";

@Component({
  selector: "app-edi-due-date",
  templateUrl: "./edi-due-date.component.html",
  styleUrl: "./edi-due-date.component.scss",
  standalone: false,
})
export class EdiDueDateComponent extends FComponentBase {
  @ViewChild("calendar") calendar!: FullCalendarComponent;
  viewModel: EDIPharmaDueDateModel[] = [];
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "",
    },
    initialView: "dayGridMonth",
    weekends: true,
    editable: false,
    selectable: false,
    dayMaxEvents: true,
    locale: "ko",
    timeZone: "UTC",
    datesSet: this.datesSet.bind(this),
    eventsSet: this.eventSet.bind(this),
    contentHeight: "800px",
  });
  constructor(private thisService: EdiDueDateService, private cd: ChangeDetectorRef) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.UserChanger, UserRole.Employee, UserRole.EdiChanger));
    const sub = new Subject<any>();
    this.sub.push(sub);
    this.translateService.onLangChange.pipe(takeUntil(sub)).subscribe((event: LangChangeEvent) => {
      this.calendarOptions.update((options) => ({
        ...options,
        locale: event.lang
      }));
    });
  }

  override async ngInit(): Promise<void> {
    await this.getList();
  }

  async getList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(FExtensions.dateToYYYYMMdd(this.calendar.getApi().getDate())),
      e => this.fDialogService.error("getList", e));
    this.setLoading(false);
    if (ret.result) {
      this.calendar.getApi().removeAllEvents();
      this.viewModel = ret.data ?? [];
      this.viewModel.forEach(x => {
        this.addEvent(x);
      });
      return;
    }
    this.fDialogService.warn("getList", ret.msg);
  }
  async getListRange(startDate: Date, endDate: Date): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getListRange(FExtensions.dateToYYYYMMdd(startDate), FExtensions.dateToYYYYMMdd(endDate)),
      e => this.fDialogService.error("getListRange", e));
    this.setLoading(false);
    if (ret.result) {
      this.calendar.getApi().removeAllEvents();
      this.viewModel = ret.data ?? [];
      this.viewModel.forEach(x => {
        this.addEvent(x);
      });
      return;
    }
    this.fDialogService.warn("getListRange", ret.msg);
  }

  async datesSet(datesSetArg: DatesSetArg): Promise<void> {
    if (this.haveRole) {
      await this.getListRange(datesSetArg.start, datesSetArg.end);
    }
  }
  async eventSet(events: EventApi[]): Promise<void> {
    this.cd.detectChanges();
  }

  addEvent(dueDateModel: EDIPharmaDueDateModel): void {
    this.calendar.getApi().addEvent({
      title: dueDateModel.orgName,
      start: FExtensions.stringToDate(`${dueDateModel.year}-${dueDateModel.month}-${dueDateModel.day}`),
      allDay: true,
      extendedProps: {
        "thisPK": dueDateModel.thisPK,
        "pharmaPK": dueDateModel.pharmaPK
      }
    });
  }
}

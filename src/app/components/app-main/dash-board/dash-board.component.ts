import { Component } from "@angular/core";
import {FComponentBase} from "../../../guards/f-component-base";
import {UserRole} from "../../../models/rest/user/user-role";
import {ChartData, ChartDataset} from "chart.js";
import {DashboardService} from "../../../services/rest/dashboard.service";
import * as FExtension from "../../../guards/f-extensions";
import {HowMuchHospitalModel} from "../../../models/rest/how-much-hospital-model";
import {HowMuchPharmaModel} from "../../../models/rest/how-much-pharma-model";
import {HowMuchMedicineModel} from "../../../models/rest/how-much-medicine-model";

@Component({
  selector: "app-dash-board",
  templateUrl: "./dash-board.component.html",
  styleUrl: "./dash-board.component.scss",
  standalone: false,
})
export class DashBoardComponent extends FComponentBase {
  chartOption1: any;
  chartOption2: any;
  chartOption3: any;
  chartData1: ChartData<"pie", number[]> = new class implements ChartData<"pie", number[]> {
    datasets: ChartDataset<"pie", number[]>[] = [];
    labels: string[] = [];
    xLabels: string[] = [];
    yLabels: string[] = [];
  }
  chartData2: ChartData<"bar", number[]> = new class implements ChartData<"bar", number[]> {
    datasets: ChartDataset<"bar", number[]>[] = [];
    labels: string[] = [];
    xLabels: string[] = [];
    yLabels: string[] = [];
  }
  chartData3: ChartData<"bar", number[]> = new class implements ChartData<"bar", number[]> {
    datasets: ChartDataset<"bar", number[]>[] = [];
    labels: string[] = [];
    xLabels: string[] = [];
    yLabels: string[] = [];
  }
  tableData1: HowMuchHospitalModel[] = [];
  tableData2: HowMuchPharmaModel[] = [];
  tableData3: HowMuchMedicineModel[] = [];
  date: Date = new Date();
  constructor(private thisService: DashboardService) {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
    this.layoutInit();
  }

  override async ngInit(): Promise<void> {
    await this.refreshData();
  }

  layoutInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    this.chartOption1 = {
      plugins: {
        legend: {
          labels: {
            userPointStyle: true,
            color: textColor
          }
        }
      }
    };
    this.chartOption2 = {
      plugins: {
        legend: {
          labels: {
            fontColor: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
    this.chartOption3 = {
      plugins: {
        legend: {
          labels: {
            fontColor: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  async getChartData(): Promise<void> {
    let ret = await this.getHos();
    if (!ret) {
      return;
    }
    ret = await this.getPharma();
    if (!ret) {
      return;
    }
    ret = await this.getMedicine();
    if (!ret) {
      return;
    }
  }
  async getHos(): Promise<boolean> {
    const ret = await FExtension.restTry(async() => await this.thisService.getListHos(this.dateToString()),
      e => this.fDialogService.error("getHos", e));
    if (ret.result) {
      const buff = ret.data ?? [];
      this.chartData1 = {
        labels: buff.map(x => x.name),
        datasets: [
          {
            data: buff.map(x => x.price),
            label: "price",
            backgroundColor: buff.map((x, index) => this.randomBackgroundColor()[index % 10]),
            hoverBackgroundColor: buff.map((x, index) => this.randomHoverBackgroundColor()[index % 10]),
          }
        ]
      };
      this.tableData1 = buff;
      return true;
    }
    this.fDialogService.warn("getHos", ret.msg);
    return false;
  }
  async getPharma(): Promise<boolean> {
    const ret = await FExtension.restTry(async() => await this.thisService.getListPharma(this.dateToString()),
      e => this.fDialogService.error("getPharma", e));
    if (ret.result) {
      const buff = ret.data ?? [];
      this.chartData2 = {
        labels: buff.map(x => x.name),
        datasets: [
          {
            data: buff.map(x => x.price),
            label: "price",
            backgroundColor: buff.map((x, index) => this.randomBackgroundColor()[index % 10]),
            hoverBackgroundColor: buff.map((x, index) => this.randomHoverBackgroundColor()[index % 10]),
            borderColor: buff.map((x, index) => this.randomBorderColor()[index % 10]),
            borderWidth: 1
          }
        ]
      };
      this.tableData2 = buff;
      return true;
    }
    this.fDialogService.warn("getPharma", ret.msg);
    return false;
  }
  async getMedicine(): Promise<boolean> {
    const ret = await FExtension.restTry(async() => await this.thisService.getListMedicine(this.dateToString()),
      e => this.fDialogService.error("getMedicine", e));
    if (ret.result) {
      const buff = ret.data ?? [];
      this.chartData3 = {
        labels: buff.map(x => x.name),
        datasets: [
          {
            data: buff.map(x => x.price),
            label: "price",
            backgroundColor: buff.map((x, index) => this.randomBackgroundColor()[index % 10]),
            hoverBackgroundColor: buff.map((x, index) => this.randomHoverBackgroundColor()[index % 10]),
            borderColor: buff.map((x, index) => this.randomBorderColor()[index % 10]),
            borderWidth: 1
          }
        ]
      };
      this.tableData3 = buff;
      return true;
    }
    this.fDialogService.warn("getMedicine", ret.msg);
    return false;
  }
  async refreshData(): Promise<void> {
    if (this.haveRole) {
      this.setLoading();
      await this.getChartData();
      this.setLoading(false);
    }
  }


  randomBackgroundColor(): string[] {
    const documentStyle = getComputedStyle(document.documentElement);
    return [
      documentStyle.getPropertyValue("--p-blue-400"),
      documentStyle.getPropertyValue("--p-orange-400"),
      documentStyle.getPropertyValue("--p-green-400"),
      documentStyle.getPropertyValue("--p-red-400"),
      documentStyle.getPropertyValue("--p-gray-400"),
      documentStyle.getPropertyValue("--p-cyan-400"),
      documentStyle.getPropertyValue("--p-pink-400"),
      documentStyle.getPropertyValue("--p-indigo-400"),
      documentStyle.getPropertyValue("--p-teal-400"),
      documentStyle.getPropertyValue("--p-purple-400"),
    ];
  }
  randomHoverBackgroundColor(): string[] {
    const documentStyle = getComputedStyle(document.documentElement);
    return [
      documentStyle.getPropertyValue("--p-blue-200"),
      documentStyle.getPropertyValue("--p-orange-200"),
      documentStyle.getPropertyValue("--p-green-200"),
      documentStyle.getPropertyValue("--p-red-200"),
      documentStyle.getPropertyValue("--p-gray-200"),
      documentStyle.getPropertyValue("--p-cyan-200"),
      documentStyle.getPropertyValue("--p-pink-200"),
      documentStyle.getPropertyValue("--p-indigo-200"),
      documentStyle.getPropertyValue("--p-teal-200"),
      documentStyle.getPropertyValue("--p-purple-200"),
    ];
  }
  randomBorderColor(): string[] {
    const documentStyle = getComputedStyle(document.documentElement);
    return [
      documentStyle.getPropertyValue("--p-blue-700"),
      documentStyle.getPropertyValue("--p-orange-700"),
      documentStyle.getPropertyValue("--p-green-700"),
      documentStyle.getPropertyValue("--p-red-700"),
      documentStyle.getPropertyValue("--p-gray-700"),
      documentStyle.getPropertyValue("--p-cyan-700"),
      documentStyle.getPropertyValue("--p-pink-700"),
      documentStyle.getPropertyValue("--p-indigo-700"),
      documentStyle.getPropertyValue("--p-teal-700"),
      documentStyle.getPropertyValue("--p-purple-700"),
    ];
  }
  dateToString(): string {
    return FExtension.dateToYYYYMMdd(this.date);
  }

  protected readonly ellipsis = FExtension.ellipsis;
  protected readonly getEDIStateSeverity = FExtension.getEDIStateSeverity;
}

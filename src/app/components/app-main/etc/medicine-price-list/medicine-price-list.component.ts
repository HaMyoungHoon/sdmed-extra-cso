import {Component, ElementRef, ViewChild} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import * as FExtensions from "../../../../guards/f-extensions";
import * as FConstants from "../../../../guards/f-constants";
import {Table} from "primeng/table";
import {MedicineModel} from "../../../../models/rest/medicine/medicine-model";
import {MedicinePriceListService} from "../../../../services/rest/medicine-price-list.service";

@Component({
  selector: "app-medicine-price-list",
  templateUrl: "./medicine-price-list.component.html",
  styleUrl: "./medicine-price-list.component.scss",
  standalone: false,
})
export class MedicinePriceListComponent extends FComponentBase {
  @ViewChild("listTable") listTable!: Table;
  @ViewChild("inputPriceUploadExcel") inputPriceUploadExcel!: ElementRef<HTMLInputElement>;
  @ViewChild("inputMainIngredientUploadExcel") inputMainIngredientUploadExcel!: ElementRef<HTMLInputElement>;
  lastApplyDate?: Date;
  applyDate: Date = new Date();
  initValue: MedicineModel[] = [];
  medicineModel: MedicineModel[] = [];
  isSorted: boolean | null = null;
  constructor(private thisService: MedicinePriceListService) {
    super();
  }

  override async ngInit(): Promise<void> {
    await this.getMedicinePriceList();
  }
  async getMedicinePriceList(): Promise<void> {
    this.setLoading();
    const ret = await FExtensions.restTry(async() => await this.thisService.getList(),
      e => this.fDialogService.error("get medicine", e));
    this.setLoading(false);
    if (ret.result) {
      this.initValue = ret.data ?? [];
      this.medicineModel = [...this.initValue];
      return;
    }
    this.fDialogService.warn("get medicine", ret.msg);
  }

  getApplyDate(data: MedicineModel): string {
    if (data.medicinePriceModel.length <= 0) {
      return "None";
    }

    return FExtensions.dateToYYYYMMdd(data.medicinePriceModel[0].applyDate);
  }
  disablePriceHistory(data: MedicineModel): boolean {
    return data.medicinePriceModel.length <= 0;
  }

  async refresh(): Promise<void> {
    return await this.getMedicinePriceList();
  }

  get filterFields(): string[] {
    return ["name", "kdCode", "pharma", "maxPrice"];
  }
  get uploadPriceTooltip(): string {
    return "medicine-price-list.price-excel";
  }
  get uploadMainIngredient(): string {
    return "medicine-price-list.main-ingredient-excel";
  }

  tableNgClass(item: MedicineModel): {"zero-price": boolean} {
    return {"zero-price": item.maxPrice === 0};
  }

  protected readonly customSort = FExtensions.customSort
  protected readonly filterTable = FExtensions.filterTable;
  protected readonly dateToYYYYMMdd = FExtensions.dateToYYYYMMdd;
  protected readonly tableStyle = FConstants.tableStyle;
  protected readonly filterTableOption = FConstants.filterTableOption;
}

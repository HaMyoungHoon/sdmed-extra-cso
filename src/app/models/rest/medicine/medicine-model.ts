import {MedicinePriceModel} from "./medicine-price-model";
import {MedicineSubModel} from "./medicine-sub-model";
import {MedicineIngredientModel} from "./medicine-ingredient-model";

export class MedicineModel {
  thisPK: string = "";
  code: number = 0;
  mainIngredientCode: string = "";
  kdCode: number = 0;
  standardCode: number = 0;
  pharma: string = "";
  name: string = ""
  customPrice: number = 0;
  maxPrice: number = 0;
  inVisible: boolean = false;
  medicineSubModel: MedicineSubModel = new MedicineSubModel();
  medicineIngredientModel: MedicineIngredientModel = new MedicineIngredientModel();
  medicinePriceModel: MedicinePriceModel[] = [];

  init(data: MedicineModel): MedicineModel {
    this.thisPK = data.thisPK;
    this.code = data.code;
    this.mainIngredientCode = data.mainIngredientCode;
    this.kdCode = data.kdCode;
    this.standardCode = data.standardCode;
    this.pharma = data.pharma;
    this.name = data.name;
    this.customPrice = data.customPrice;
    this.maxPrice = data.maxPrice;
    this.inVisible = data.inVisible;
    this.medicineSubModel = data.medicineSubModel;
    this.medicineIngredientModel = data.medicineIngredientModel;
    this.medicinePriceModel = data.medicinePriceModel;
    return this;
  }
  copyLhsFromRhs(lhs: MedicineModel, rhs: MedicineModel): void {
    lhs.thisPK = rhs.thisPK;
    lhs.code = rhs.code;
    lhs.mainIngredientCode = rhs.mainIngredientCode;
    lhs.kdCode = rhs.kdCode;
    lhs.standardCode = rhs.standardCode;
    lhs.pharma = rhs.pharma;
    lhs.name = rhs.name;
    lhs.customPrice = rhs.customPrice;
    lhs.maxPrice = rhs.maxPrice;
    lhs.inVisible = rhs.inVisible;
    lhs.medicineSubModel = rhs.medicineSubModel;
    lhs.medicineIngredientModel = rhs.medicineIngredientModel;
    lhs.medicinePriceModel = rhs.medicinePriceModel;
  }
}

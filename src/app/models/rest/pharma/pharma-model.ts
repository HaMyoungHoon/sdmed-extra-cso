import {BillType} from "../bill-type";
import {PharmaType} from "./pharma-type";
import {PharmaGroup} from "./pharma-group";
import {ContractType} from "../contract-type";
import {DeliveryDiv} from "../delivery-div";
import {MedicineModel} from "../medicine/medicine-model";

export class PharmaModel {
  thisPK: string = "";
  code: string = "";
  orgName: string = "";
  innerName: string = "";
  ownerName: string = "";
  taxpayerNumber: string = "";
  address: string = "";
  phoneNumber: string = "";
  faxNumber: string = "";
  zipCode: string = "";
  openDate?: Date;
  retroactiveRule: string = "";
  innerSettlementRule: string = "";
  outerSettlementRule: string = "";
  etc1: string = "";
  etc2: string = "";
  imageUrl: string = "";
  inVisible: boolean = false;
  medicineList: MedicineModel[] = [];
  relationMedicineList: MedicineModel[] = [];

  init(data: PharmaModel): PharmaModel {
    this.thisPK = data.thisPK;
    this.code = data.code;
    this.orgName = data.orgName;
    this.innerName = data.innerName;
    this.ownerName = data.ownerName;
    this.taxpayerNumber = data.taxpayerNumber;
    this.address = data.address;
    this.phoneNumber = data.phoneNumber;
    this.faxNumber = data.faxNumber;
    this.zipCode = data.zipCode;
    this.openDate = data.openDate;
    this.retroactiveRule = data.retroactiveRule;
    this.innerSettlementRule = data.innerSettlementRule;
    this.outerSettlementRule = data.outerSettlementRule;
    this.etc1 = data.etc1;
    this.etc2 = data.etc2;
    this.imageUrl = data.imageUrl;
    this.inVisible = data.inVisible;
    this.medicineList = data.medicineList;
    this.relationMedicineList = data.relationMedicineList;
    return this;
  }
  copyLhsFromRhs(lhs: PharmaModel, rhs: PharmaModel): void {
    lhs.thisPK = rhs.thisPK;
    lhs.code = rhs.code;
    lhs.orgName = rhs.orgName;
    lhs.innerName = rhs.innerName;
    lhs.ownerName = rhs.ownerName;
    lhs.taxpayerNumber = rhs.taxpayerNumber;
    lhs.address = rhs.address;
    lhs.phoneNumber = rhs.phoneNumber;
    lhs.faxNumber = rhs.faxNumber;
    lhs.zipCode = rhs.zipCode;
    lhs.openDate = rhs.openDate;
    lhs.retroactiveRule = rhs.retroactiveRule;
    lhs.innerSettlementRule = rhs.innerSettlementRule;
    lhs.outerSettlementRule = rhs.outerSettlementRule;
    lhs.etc1 = rhs.etc1;
    lhs.etc2 = rhs.etc2;
    lhs.imageUrl = rhs.imageUrl;
    lhs.inVisible = rhs.inVisible;
    lhs.medicineList = rhs.medicineList;
    lhs.relationMedicineList = rhs.relationMedicineList;
  }
}

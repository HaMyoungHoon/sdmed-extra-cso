import {PharmaModel} from "../pharma/pharma-model";

export class HospitalModel {
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
  businessType: string = "";
  businessItem: string = "";
  nursingHomeNumber: string = "";
  etc1: string = "";
  etc2: string = "";
  imageUrl: string = "";
  inVisible: boolean = false;
  pharmaList: PharmaModel[] = [];

  init(data: HospitalModel): HospitalModel {
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
    this.businessType = data.businessType;
    this.businessItem = data.businessItem;
    this.nursingHomeNumber = data.nursingHomeNumber;
    this.etc1 = data.etc1;
    this.etc2 = data.etc2;
    this.imageUrl = data.imageUrl;
    this.inVisible = data.inVisible;
    this.pharmaList = data.pharmaList;
    return this;
  }
  copyLhsFromRhs(lhs: HospitalModel, rhs: HospitalModel): void {
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
    lhs.businessType = rhs.businessType;
    lhs.businessItem = rhs.businessItem;
    lhs.nursingHomeNumber = rhs.nursingHomeNumber;
    lhs.etc1 = rhs.etc1;
    lhs.etc2 = rhs.etc2;
    lhs.imageUrl = rhs.imageUrl;
    lhs.inVisible = rhs.inVisible;
    lhs.pharmaList = rhs.pharmaList;
  }
}

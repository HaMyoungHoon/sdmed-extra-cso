export enum HospitalTempFileType {
  TAXPAYER = "TAXPAYER"
}

export function stringToHospitalTempFileType(data?: string): HospitalTempFileType {
  return HospitalTempFileType.TAXPAYER
}

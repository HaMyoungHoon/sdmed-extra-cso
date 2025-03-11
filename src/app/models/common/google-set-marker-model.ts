import * as FConstants from "../../guards/f-constants";

export class GoogleSetMarkerModel {
  content: string = "";
  position: {lat: number, lng: number} = { lat: FConstants.DEF_LAT, lng: FConstants.DEF_LNG };
}

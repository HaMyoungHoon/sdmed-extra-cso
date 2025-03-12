import * as FConstants from "../../guards/f-constants";

export class GoogleSetMarkerModel {
  title: string = "";
  content: string = "";
  position: {lat: number, lng: number} = { lat: FConstants.DEF_LAT, lng: FConstants.DEF_LNG };
  icon: HTMLImageElement = new Image(24, 24);
}

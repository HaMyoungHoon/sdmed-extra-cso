import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {MqttConnectModel} from "../../models/rest/mqtt/mqtt-connect-model";
import {MqttContentModel} from "../../models/rest/mqtt/mqtt-content-model";
import mqtt from "mqtt";
import * as FConstants from "../../guards/f-constants";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FExtensions from "../../guards/f-extensions";
import {Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MqttService {
  private baseUrl = "/apiCSO/mqtt";
  mqttClient?: mqtt.MqttClient
  mqttMessageSubject: Subject<MqttContentModel> = new Subject();

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getSubscribe(): Promise<RestResult<MqttConnectModel>> {
    const mqttConnectData = FAmhohwa.getLocalStorage(FConstants.MQTT_CONNECT_DATA);
    if (mqttConnectData.length > 0) {
      return new Promise((resolve) => {
        resolve(new RestResult<MqttConnectModel>().getResult(JSON.parse(mqttConnectData)));
      });
    }
    return this.httpResponse.get(`${this.baseUrl}/subscribe`);
  }
  postPublish(topic: string, mqttContentModel: MqttContentModel): Promise<RestResult<any>> {
    this.httpResponse.addParam("topic", topic);
    return this.httpResponse.post(`${this.baseUrl}/publish`, mqttContentModel);
  }
  mqttConnect(mqttConnectModel: MqttConnectModel): void {
    if (this.mqttClient?.connected) {
      return;
    }
    const clientId: string = mqttConnectModel.topic.length > 1 ? mqttConnectModel.topic[1] : FAmhohwa.getRandomUUID();
    const options: mqtt.IClientOptions = {
      defaultProtocol: "wss",
      protocol: "wss",
      clientId: `intra-cso-${clientId}`
    }
    const search: string[] = mqttConnectModel.brokerUrl.filter(x => x.includes("ws://") || x.includes("wss://"));
    if (search.length <= 0) {
      throw new Error("something wrong");
    }

    this.mqttClient = mqtt.connect(search[0], options);
    this.mqttClient.on("connect", (): void => {
      mqttConnectModel.topic.forEach((x: string): void => {
        this.mqttClient?.subscribe(x, (err: Error | null): void => {
          if (err) {
            throw new Error(err.message);
          }
        });
      });
    });
    this.mqttClient.on("message", (topic: string, message: Buffer): void => {
      this.mqttMessageSubject.next(new MqttContentModel().parseThis(topic, message));
    });
  }
  mqttDisconnect(): void {
    if (this.mqttClient?.connected) {
      this.mqttClient.end();
    }
    FAmhohwa.removeLocalStorage(FConstants.MQTT_CONNECT_DATA);
  }
  setMqttMessageObserver(func: FExtensions.anyFunc | undefined): void {
    this.mqttMessageSubject.pipe().subscribe((x: MqttContentModel): void => {
      if (func) {
        func(x);
      }
    });
  }
}

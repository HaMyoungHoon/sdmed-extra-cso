export class MqttContentModel {
  topic: string = "";
  senderPK: string = "";
  senderName: string = "";
  content: string = "";
  targetItemPK: string = "";

  parseThis(topic: string, payload: Buffer): MqttContentModel {
    this.topic = topic;
    console.log(payload);
    return this;
  }
}

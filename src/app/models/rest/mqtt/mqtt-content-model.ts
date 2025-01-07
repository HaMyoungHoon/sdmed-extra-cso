export class MqttContentModel {
  topic: string = "";
  content: string = "";
  targetItemPK: string = "";

  parseThis(topic: string, message: Buffer): MqttContentModel {
    this.topic = topic;
    console.log(message);
    return this;
  }
}

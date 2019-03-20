import * as MqttService from "mqtt";
import {MqttMessage} from './Interfaces';
import {Subject} from 'rxjs';
import * as MQTTPattern from "mqtt-pattern";


export class Mqtt {

  private _mqtt;
  private _host: string;
  private _port: number;
  private _username: string;
  private _password: string;

  public subscriptions: Subject<MqttMessage>[] = [];

  /**
   * constructor
   */
  private constructor(host: string, port: number, username: string, password: string) {

    this._host = host;
    this._port = port;
    this._username = username;
    this._password = password;


    this._mqtt = MqttService.connect(this._host, {
      username: this._username,
      password: this._password,
      port: this._port,
    })

    this._mqtt.on('message', (topic, message) => this.onMessage(
      {
        topic: topic,
        message: message
      }
    ))

    this._mqtt.on('error', (error) => console.log(error));


  }


  /**
   *
   * @param channel
   */
  register(channel: string) {

    //if is not subscribed, make new subscription.
    if (this.subscriptions[channel] === undefined) {
      this._mqtt.subscribe(channel);
      this.subscriptions[channel] = new Subject<MqttMessage>();
    }


    return this.subscriptions[channel];
  }

  /**
   *
   * @param topic
   * @param message
   */
  onMessage(mqttMessage: MqttMessage) {

    //loop over subscriptions
    for (let registration in this.subscriptions) {

      if (MQTTPattern.matches(registration, mqttMessage.topic)) {
        this.subscriptions[registration].next(mqttMessage);
      }
    }

  }


}


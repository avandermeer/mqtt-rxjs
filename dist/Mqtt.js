"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MqttService = require("mqtt");
const rxjs_1 = require("rxjs");
const MQTTPattern = require("mqtt-pattern");
class Mqtt {
    /**
     * constructor
     */
    constructor(host, port, username, password) {
        this.subscriptions = [];
        this._host = host;
        this._port = port;
        this._username = username;
        this._password = password;
        this._mqtt = MqttService.connect(this._host, {
            username: this._username,
            password: this._password,
            port: this._port,
        });
        this._mqtt.on('message', (topic, message) => this.onMessage({
            topic: topic,
            message: message
        }));
        this._mqtt.on('error', (error) => console.log(error));
    }
    /**
     *
     * @param channel
     */
    register(channel) {
        //if is not subscribed, make new subscription.
        if (this.subscriptions[channel] === undefined) {
            this._mqtt.subscribe(channel);
            this.subscriptions[channel] = new rxjs_1.Subject();
        }
        return this.subscriptions[channel];
    }
    /**
     *
     * @param topic
     * @param message
     */
    onMessage(mqttMessage) {
        //loop over subscriptions
        for (let registration in this.subscriptions) {
            if (MQTTPattern.matches(registration, mqttMessage.topic)) {
                this.subscriptions[registration].next(mqttMessage);
            }
        }
    }
}
exports.Mqtt = Mqtt;
//# sourceMappingURL=Mqtt.js.map
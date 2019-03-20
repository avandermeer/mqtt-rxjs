import { MqttMessage } from './Interfaces';
import { Subject } from 'rxjs';
export declare class Mqtt {
    private _mqtt;
    private _host;
    private _port;
    private _username;
    private _password;
    subscriptions: Subject<MqttMessage>[];
    /**
     * constructor
     */
    private constructor();
    /**
     *
     * @param channel
     */
    register(channel: string): any;
    /**
     *
     * @param topic
     * @param message
     */
    onMessage(mqttMessage: MqttMessage): void;
}

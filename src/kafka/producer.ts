import { Producer } from "kafkajs";
import { log } from "../utils/logger/logger";
import { TimerEvent } from "./event";
import { kafkaClient } from "./kafka";

export class BaseProducer {
    private producer: Producer | undefined;

    constructor() {
        //On Receiving SIGTERM stop the consumer
        process.on("SIGTERM", () => {
            log.warn(`SIGTERM Received! going to stop producer `);
            setTimeout(async () => {
                await this.producer?.disconnect();
                log.error(`producer stopped`);
            }, 5 * 1000);
        });
    }

    connect(producer: Producer):void{
        if(!this.producer){
            this.producer = producer;
        }
    }

    async sendMessage(key: string, event: TimerEvent): Promise<void> {
        if(!this.producer){
            this.connect(await kafkaClient.getProducer())
        }
        await this.producer?.send({topic: event.topic, messages: [ { key: key, value: JSON.stringify(event.data)}]});
    }

}
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

    async sendMessage(event: TimerEvent): Promise<void> {
        try{
            log.info('Preparing to send event : '+ JSON.stringify(event));
            this.producer = await kafkaClient.getProducer();
            await this.producer?.send({topic: event.topic, messages: [ { value: JSON.stringify(event.data)}]});
        }catch(e){
            log.error('Error while sending kafka event :', e)
        }
    }
}
import { Consumer, Kafka, logLevel, Producer } from 'kafkajs';
import { log } from '../utils/logger/logger';

class KafkaClient {
    private kafka: Kafka | undefined;
    private producer: Producer | undefined;

    constructor() {
        const brokers = process.env.BOOTSTRAP_SERVER
            ? process.env.BOOTSTRAP_SERVER.split(',')
            : [];

        log.info(brokers);
        log.info(process.env.KAFKA_AUTH_TYPE)
        if (process.env.KAFKA_AUTH_TYPE == 'plain' || !process.env.KAFKA_AUTH_TYPE) {
            log.info(process.env.KAFKA_AUTH_TYPE)
            this.kafka = new Kafka({
                logLevel: logLevel.ERROR,
                clientId: process.env.KAFKA_CLIENT_ID || 'ivr2-event-client',
                brokers,
            });
        } else if (process.env.KAFKA_AUTH_TYPE == 'sasl') {
            //! This will work with Confluent
            this.kafka = new Kafka({
                logLevel: logLevel.DEBUG,
                clientId: process.env.KAFKA_CLIENT_ID || 'ivr2-event-client',
                brokers,
                ssl: true,
                sasl: {
                    mechanism: 'plain',
                    password: process.env.KAFKA_PASSWORD!,
                    username: process.env.KAFKA_USERNAME!,
                },
            });
        }
    }

    public async getProducer(): Promise<Producer> {
        if (this.producer) {
            log.info('producer already connected returning the instance!');
            return this.producer;
        } else {
            log.info('producer not connected, going to connect it');
            this.producer = this.kafka!.producer();
            await this.producer.connect();
            log.info('producer connected successfully returning the instance');
            return this.producer;
        }
    }

    public async getConsumer(groupId: string): Promise<Consumer> {
        let consumer: Consumer = this.kafka!.consumer({ groupId });
        await consumer.connect();
        if(groupId != 'health-group'){
            log.info('consumer started : '+groupId);
        }
        return consumer;
    }

}

// export an instance of the kafka client, this will behave like a singleton
export const kafkaClient = new KafkaClient();
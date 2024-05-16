import Redis from "ioredis";
import { log } from "../utils/logger/logger";
import { CHANNEL, Topics } from "../utils/constants/constants";
import { BaseProducer } from "../kafka/producer";
import { TimerEvent } from "../kafka/event";

export class RedisConnectionManager {

  private static redis: any;

  private constructor() {}

  public static async connectClient(): Promise<void> {
    if (!this.redis) {

       const URL: string = process.env.REDIS_URL || 'redis://localhost:6379';

        this.redis = new Redis(URL);

        this.redis.config('set', 'notify-keyspace-events', 'Ex');

        const expiredSub = new Redis(URL);

        expiredSub.subscribe(CHANNEL.EXPIRED, (err, count) => {
          if(err){
            log.error('Failed to subscribe', err);
          } else {
            log.info('Subscribed successfully.')
          }
        });

        expiredSub.on('message', async (channel: string, message: string) => {
          if(channel === CHANNEL.EXPIRED){
            const messageData = message.split('_');
            const key: string = messageData.pop() || 'ccId';
            const timerEvent : TimerEvent = {
              topic: Topics.TIMER,
              data: {
                timerId: message
              }
            };
            await new BaseProducer().sendMessage(key, timerEvent)
          }
        });
    }
    log.info('Redis Connected');
  }

  public static async getClient(): Promise<any> {
    log.info('Getting existing redis client');
    if(!this.redis){
      await this.connectClient();
    }
    return this.redis;
  }
}
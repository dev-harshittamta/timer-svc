require('dotenv').config();
import express, { Express } from "express"
import router from "./routes/routes";
import { RedisConnectionManager } from "./redis/redis";
import { log } from "./utils/logger/logger";
import { kafkaClient } from "./kafka/kafka";

const PORT = process.env.PORT || 3014;

const app : Express = express();

app.use(express.json());

app.use('/api/timer/v', router);

app.listen(PORT, async () => {
    await RedisConnectionManager.connectClient();
    await kafkaClient.getProducer();
    log.info(`Server started on port : ${PORT}`)
});
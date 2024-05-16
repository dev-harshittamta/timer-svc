import {Request, Response} from "express"
import { RedisConnectionManager } from "../redis/redis";
import { log } from "../utils/logger/logger";
import { API_MESSAGE, API_STATUS, TIMEOUT_MESSAGE } from "../utils/constants/constants";

export default class TimerController {
    static async submit (req: Request, res: Response) {
        try {
            const {timerId, timeoutInSeconds} = req.body;
            log.info(`Received a request to submit timer with timout in seconds : ${timeoutInSeconds}`);
            const client = await RedisConnectionManager.getClient();
            await client.setex(timerId, timeoutInSeconds, TIMEOUT_MESSAGE.EXPIRED);
            log.info('Timer set successfully.');
            res.status(201).send({
                status: API_STATUS.SUCCESS,
                message: API_MESSAGE.SET_TIMER_SUCCESS
            });
        }catch(e){
            log.error('Error while setting : ', e);
            res.status(500).send({
                status: API_STATUS.FAILED,
                message: API_MESSAGE.SET_TIMER_ERROR
            });
        }
    }

    static async delete (req: Request, res: Response) {
        try{
            const { timerId } = req.params;
            log.info('Received a request to delete timer');
            const client = await RedisConnectionManager.getClient();
            const result = await client.del(timerId);
            if(result){
                log.info('Timer deleted successfully.');
                res.status(200).send({
                    status: API_STATUS.SUCCESS,
                    message: API_MESSAGE.DEL_TIMER_SUCCESS
                });
            } else {
                log.error('Error while deleting.');
                res.status(400).send({
                    status: API_STATUS.FAILED,
                    message: API_MESSAGE.TIMER_NOT_FOUND
                });
            }
        }catch(e){
            log.error('Error while deleting : ', e);
            res.status(500).send({
                status: API_STATUS.FAILED,
                message: API_MESSAGE.DEL_TIMER_ERROR
            });
        }
    }
}
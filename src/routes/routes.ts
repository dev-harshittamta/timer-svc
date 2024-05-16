import { Router } from "express";
import TimerController from "../controllers/timer.controller";
import { deleteSchema, submitSchema } from "../schemas/routes.schema";
import validateRequest from "../middelwares/validator.middelware";
import { PARSE_TYPE } from "../utils/constants/constants";
import asyncLoggerMiddleware from "../middelwares/logger.middelware";

const router = Router();

router.post('/submit', asyncLoggerMiddleware ,validateRequest(submitSchema, PARSE_TYPE.BODY), TimerController.submit);
router.delete('/timerId/:timerId/delete', asyncLoggerMiddleware ,validateRequest(deleteSchema, PARSE_TYPE.PARAMS), TimerController.delete);

export default router;
import {NextFunction, Request, Response} from "express";
import {asyncLocalStorage} from "../utils/logger/logger";

const asyncLoggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const paramMap: Map<string, string> = new Map();
    if (req.params.timerId) {
        paramMap.set('timerId', req.params.timerId);
    } else if (req.body.timerId){
        paramMap.set('timerId', req.body.timerId);
    }
    asyncLocalStorage.enterWith(paramMap);
    next();
}

export default asyncLoggerMiddleware;
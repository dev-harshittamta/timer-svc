import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { API_MESSAGE, API_STATUS } from '../utils/constants/constants';

const validateRequest = (schema: z.ZodType<any>, parseType: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if(parseType === 'body'){
          schema.parse(req.body);
      } else if (parseType === 'params'){
          schema.parse(req.params);
      }
      next();
    } catch (error : any) {
      return res.status(400).json({ status: API_STATUS.FAILED, message: API_MESSAGE.VALIDATION_FAILED, details: error.issues });
    }
};

export default validateRequest;
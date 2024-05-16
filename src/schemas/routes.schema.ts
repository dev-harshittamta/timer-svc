import { z, ZodObject } from 'zod';

export const submitSchema : ZodObject<any> = z.object({
    timerId: z.string(),
    timeoutInSeconds: z.number(),
});

export const deleteSchema : ZodObject<any>  = z.object({
    timerId: z.string()
});
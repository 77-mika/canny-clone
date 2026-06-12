import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import AppError from "../errors/AppError";


const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body ?? {}, {
            abortEarly: false,
        });

        if (error) {
            const message = error.details.map((d) => d.message).join(", ");
            next(new AppError(message, 400));
            return;
        }

        next();
    };
};

export default validate;

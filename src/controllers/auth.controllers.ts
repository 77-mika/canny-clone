import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import AppError from "../errors/AppError";

const signToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        // expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        expiresIn: "7d",
    });
};

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError("Email already in use", 400));
        }

        const user = await User.create({ name, email, password });
        const token = signToken(user._id.toString());

        res.status(201).json({
            status: "success",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const signin = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError("Invalid email or password", 401));
        }

        const token = signToken(user._id.toString());

        res.status(200).json({
            status: "success",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

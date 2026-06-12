import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import Feedback from "../models/Feedback";
import AppError from "../errors/AppError";

export const createFeedback = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { title, body } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const feedback = await Feedback.create({
            title,
            body,
            image,
            author: req.user?._id,
        });

        res.status(201).json({
            status: "success",
            feedback,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllFeedbacks = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const feedbacks = await Feedback.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({
            status: "succsess",
            count: feedbacks.length,
            feedbacks,
        });
    } catch (err) {
        next(err);
    }
};

export const getFeedback = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const feedback = await Feedback.findById(req.params.id).populate(
            "author",
            "name email",
        );

        if (!feedback) {
            return next(new AppError("Feedback not found", 404));
        }

        res.status(200).json({
            status: "success",
            feedback,
        });
    } catch (error) {
        next(error);
    }
};

export const toggleVote = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return next(new AppError("Feedback not found", 404));
        }

        const userId = req.user!._id as mongoose.Types.ObjectId;
        const hasVoted = feedback.votes.some((id) => id.equals(userId));

        if (hasVoted) {
            feedback.votes = feedback.votes.filter((id) => !id.equals(userId));
        } else {
            feedback.votes.push(userId);
        }

        await feedback.save();

        res.status(200).json({
            status: "success",
            voted: !hasVoted,
            voteCount: feedback.votes.length,
            feedback,
        });
    } catch (error) {
        next(error);
    }
};

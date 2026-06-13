import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import AppError from "../errors/AppError";
import { sendPasswordResetEmail } from "../services/email.service";

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError("No user found with that email", 404));
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save({ validateBeforeSave: false });

        try {
            await sendPasswordResetEmail(user.email, resetToken);
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return next(
                new AppError(
                    `Failed to send reset email. Please try again later. ${emailError instanceof Error ? emailError.message : ""}`,
                    500,
                ),
            );
        }

        res.status(200).json({
            status: "success",
            message: "if email exist,Password reset email sent",
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const token = req.params.token as string;
        const { password } = req.body;

        const resetTokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: new Date() },
        }).select("+resetPasswordToken +resetPasswordExpires +password");

        if (!user) {
            return next(new AppError("Invalid or expired reset token", 400));
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: "success",
            message: "Password has been reset successfully",
        });
    } catch (error) {
        next(error);
    }
};

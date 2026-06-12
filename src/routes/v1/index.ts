import { Router, Request, Response } from "express";
import Joi from "joi";
import authRoutes from "./auth.routes";


const router = Router();

const testSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
}).required();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Canny clone API v1" });
});

router.use("/auth", authRoutes);

export default router;

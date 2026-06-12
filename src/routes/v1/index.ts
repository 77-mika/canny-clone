import { Router, Request, Response } from "express";

import authRoutes from "./auth.routes";
import feedbackRoutes from "./feedback.routes";


const router = Router();



router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Canny clone API v1" });
});

router.use("/auth", authRoutes);
router.use("/feedbacks",feedbackRoutes)

export default router;

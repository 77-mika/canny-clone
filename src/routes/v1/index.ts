import { Router, Request, Response } from "express";
import Joi from "joi";
import validate from "../../middlewares/validate";

const router = Router();

const testSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
}).required();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Canny clone API v1" });
});

router.post("/test", validate(testSchema), (req: Request, res: Response) => {
    res.json({ message: "Valid data!", data: req.body });
});

export default router;

import { Router } from "express";
import joi from "joi";
import {
    createFeedback,
    getAllFeedbacks,
    getFeedback,
    toggleVote
} from "../../controllers/feedback.controller";
import { protect } from "../../middlewares/protect";
import validate from "../../middlewares/validate";
import upload from "../../middlewares/upload";

const router = Router();

const feedbackSchema = joi.object({
    title: joi.string().min(3).max(100).required(),
    body: joi.string().min(10).required(),
});


router.get("/",getAllFeedbacks);
router.get("/:id",getFeedback);


router.post("/",protect, upload.single("image"), validate(feedbackSchema),createFeedback);
router.patch("/:id/vote",protect,toggleVote)

export default router;
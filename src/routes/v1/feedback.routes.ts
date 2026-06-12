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

/**
 * @swagger
 * /feedbacks:
 *   get:
 *     summary: Get all feedbacks
 *     tags: [Feedbacks]
 *     responses:
 *       200:
 *         description: List of all feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: number
 *                 feedbacks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feedback'
 */
router.get("/",getAllFeedbacks);
/**
 * @swagger
 * /feedbacks/{id}:
 *   get:
 *     summary: Get a single feedback
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id",getFeedback);

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     summary: Create a new feedback
 *     tags: [Feedbacks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, body]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Dark mode support
 *               body:
 *                 type: string
 *                 example: Please add dark mode to the dashboard
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Feedback created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post("/",protect, upload.single("image"), validate(feedbackSchema),createFeedback);
/**
 * @swagger
 * /feedbacks/{id}/vote:
 *   patch:
 *     summary: Toggle vote on a feedback
 *     tags: [Feedbacks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Vote toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 voted:
 *                   type: boolean
 *                 voteCount:
 *                   type: number
 *                 feedback:
 *                   $ref: '#/components/schemas/Feedback'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:id/vote",protect,toggleVote)

export default router;
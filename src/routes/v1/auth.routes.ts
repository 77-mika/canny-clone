import { Router } from "express";
import { signup, signin } from "../../controllers/auth.controllers";
import validate from "../../middlewares/validate";
import Joi from "joi";

const authRoutes = Router();

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

authRoutes.post("/signup", validate(signupSchema), signup);
authRoutes.post("/signin", validate(signinSchema), signin);

export default authRoutes;
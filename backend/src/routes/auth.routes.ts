import express from "express";
const router = express.Router();
import { login, signup } from "../controllers/authController.js";
import { validator } from "../middleware/authvalidator.js";

router.post("/register",validator, signup);

router.post("/login", validator ,login);

export default router

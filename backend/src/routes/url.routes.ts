import { Router } from "express";
import {
  optionalAuth,
  loginCheck,
  generateUrl,
  getUserLinks,
  deleteUrl,
} from "../controllers/url.controllers.js";

const router = Router();

router.post("/shorten", optionalAuth, generateUrl);

router.get("/my/links", loginCheck, getUserLinks);
router.delete("/my/links/:code", loginCheck, deleteUrl);

export default router;

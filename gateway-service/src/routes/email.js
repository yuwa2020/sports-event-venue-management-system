import express from "express";
import { forwardToEmailService } from "../controllers/emailController.js";
import requestLogger from "../middlewares/requestlogger.js";

const router = express.Router();
router.use(requestLogger);
router.use("/*", forwardToEmailService);

export default router;

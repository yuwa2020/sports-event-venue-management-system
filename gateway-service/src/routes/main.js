import express from "express";
import { forwardToMainService } from "../controllers/mainController.js";
import requestLogger from "../middlewares/requestlogger.js";

const router = express.Router();
router.use(requestLogger);
router.use("/*", forwardToMainService);

export default router;

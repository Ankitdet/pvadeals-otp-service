import { Router } from "express";
import sendOtpRouter from "./send-otp.route";
import verifyOtpRouter from "./verify-otp.route";

const router = Router();

router.use(sendOtpRouter);
router.use(verifyOtpRouter);

export default router;

import { Router } from "express";
import redisClient from "../config/redis";

const verifyOtpRouter = Router();

// Helper to build consistent response
function buildResponse(req: any, data: object) {
  return {
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    ...data,
  };
}

// POST /verify-otp
verifyOtpRouter.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(400)
        .json(buildResponse(req, { error: "Phone and OTP are required" }));
    }

    const key = `otp:${phone}`;
    const storedOtp = await redisClient.get(key);

    if (storedOtp === otp) {
      req.log.info({ phone }, "OTP matched and deleting from redis cache.");
      await redisClient.del(key);
      req.log.info({ phone }, "OTP verified successfully");
      return res.json(
        buildResponse(req, { message: "OTP verified successfully" })
      );
    }

    req.log.warn({ phone, otp }, "Invalid or expired OTP");
    res
      .status(400)
      .json(buildResponse(req, { error: "Invalid or expired OTP" }));
  } catch (err) {
    req.log.error({ err }, "Failed to verify OTP");
    res
      .status(500)
      .json(buildResponse(req, { error: "Internal server error" }));
  }
});

export default verifyOtpRouter;

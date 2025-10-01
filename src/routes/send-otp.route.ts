import { Router } from "express";
import redisClient from "../config/redis";

const sendOtpRouter = Router();

// Generate 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to build consistent response
function buildResponse(req: any, data: object) {
  return {
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    ...data,
  };
}

// POST /send-otp
sendOtpRouter.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res
        .status(400)
        .json(buildResponse(req, { error: "Phone number is required" }));
    }

    const otp = generateOtp();
    const key = `otp:${phone}`;

    await redisClient.setEx(key, 120, otp); // TTL = 2 min

    req.log.info({ phone, otp }, "OTP generated");

    res.json(
      buildResponse(req, {
        message: `OTP ${otp} sent successfully and valid for 2 minutes`,
      })
    );
  } catch (err) {
    req.log.error({ err }, "Failed to generate OTP");
    res
      .status(500)
      .json(buildResponse(req, { error: "Internal server error" }));
  }
});

export default sendOtpRouter;

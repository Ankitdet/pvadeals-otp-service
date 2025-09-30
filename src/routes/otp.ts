import { Router } from "express";
import redisClient from "../config/redis";

const router = Router();

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
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json(buildResponse(req, { error: "Phone number/phone is required" }));
    }

    const otp = generateOtp();
    const key = `otp:${phone}`;

    await redisClient.setEx(key, 120, otp); // TTL = 2 min

    req.log.info({ phone, otp }, "OTP generated");

    res.json(buildResponse(req, { message: `OTP ${otp} sent successfully which is valid for 2 minutes` }));
  } catch (err) {
    req.log.error({ err }, "Failed to generate OTP");
    res.status(500).json(buildResponse(req, { error: "Internal server error" }));
  }
});

// POST /verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json(buildResponse(req, { error: "Phone and OTP are required" }));
    }

    const key = `otp:${phone}`;
    const storedOtp = await redisClient.get(key);

    if (storedOtp === otp) {
      req.log.info({ phone }, "OTP matched and deleting from redis cache.");
      await redisClient.del(key);
      req.log.info({ phone }, "OTP verified successfully");
      return res.json(buildResponse(req, { message: "OTP verified successfully" }));
    }

    req.log.warn({ phone, otp }, "Invalid or expired OTP");
    res.status(400).json(buildResponse(req, { error: "Invalid or expired OTP" }));
  } catch (err) {
    req.log.error({ err }, "Failed to verify OTP");
    res.status(500).json(buildResponse(req, { error: "Internal server error" }));
  }
});

export default router;

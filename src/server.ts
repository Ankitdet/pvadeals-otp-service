import express from "express";
import bodyParser from "body-parser";
import otpRoutes from "./routes/otp";
import { attachRequestId, loggerMiddleware } from "./middleware/logger";

const app = express();

app.use(bodyParser.json());
app.use(loggerMiddleware);
app.use(attachRequestId);

app.use("/api", otpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
export default app;
import express from "express";
import bodyParser from "body-parser";
import { attachRequestId, loggerMiddleware } from "./middleware/logger";
import router from "./routes";

const app = express();

app.use(bodyParser.json());
app.use(loggerMiddleware);
app.use(attachRequestId);

app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
export default app;
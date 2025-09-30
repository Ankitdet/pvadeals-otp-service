import { v4 as uuidv4 } from "uuid";
import pinoHttp from "pino-http";
import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = pinoHttp({
  genReqId: (req) => {
    return req.headers["x-request-id"]?.toString() || uuidv4();
  },
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      id: req.id,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

// Helper middleware to pass requestId in all logs
export function attachRequestId(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  (req as any).requestId = (req as any).id;
  next();
}


import type { RequestHandler } from "express";

export const requestLogger: RequestHandler = (req, res, next) => {
  const startTime = Date.now();
  const requestPath = req.originalUrl.split("?")[0];

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.info(
      `${new Date().toISOString()} ${req.method} ${requestPath} ${res.statusCode} ${duration}ms`
    );
  });

  next();
};

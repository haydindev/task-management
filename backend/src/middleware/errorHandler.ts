
import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    res.status(400).json({
      message: "Geçersiz JSON formatı.",
    });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 500
  ) {
    res.status(error.status).json({
      message: "Geçersiz HTTP isteği.",
    });
    return;
  }

  console.error("Beklenmeyen sunucu hatası:", error);

  res.status(500).json({
    message: "Sunucu hatası.",
  });
};

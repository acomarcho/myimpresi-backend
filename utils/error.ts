import { HttpError } from "@constants/errors";
import { Response } from "express";
import { ZodError } from "zod-validation-error";
import { logger } from "./logger";
import { fromZodError } from "zod-validation-error";

export function createHttpError(
  status: number,
  error: any,
  message: string
): HttpError {
  return {
    status,
    error,
    message,
  };
}

export function createHttpZodError(
  status: number,
  error: any,
  zodError: ZodError
): HttpError {
  return {
    status,
    error,
    message: fromZodError(zodError).message,
  };
}

export function isHttpError(e: any): e is HttpError {
  return (
    e &&
    typeof e === "object" &&
    "status" in e &&
    typeof e["status"] === "number" &&
    "error" in e &&
    "message" in e &&
    typeof e["message"] === "string"
  );
}

export function handleError(e: unknown, res: Response) {
  if (isHttpError(e)) {
    if (e.status >= 500) {
      logger.error(e);
    }

    return res.status(e.status).json({
      error: e.error,
      message: e.message,
    });
  }

  logger.error(e);
  res.status(500).json({
    error: e,
    message: "Internal server error",
  });
}

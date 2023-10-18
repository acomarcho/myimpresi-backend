import { HttpError } from "@constants/errors";

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

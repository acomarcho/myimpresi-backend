import { Request, Response, NextFunction } from "express";

export const checkApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("X-API-Key");

  if (token !== process.env.API_KEY) {
    return res.status(401).json({ message: "Invalid API key" });
  }
  next();
};

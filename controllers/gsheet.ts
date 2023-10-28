import GSheetService from "@services/gsheet";
import { Request, Response } from "express";
import { AppendContactRequest } from "@constants/requests/gsheet";
import { createHttpError, isHttpError } from "@utils/error";

const AppendContact = async (req: Request, res: Response) => {
  try {
    const parsedReq: AppendContactRequest = req.body;
    if (!parsedReq.name) {
      throw createHttpError(400, null, "Name is not supplied");
    }
    if (!parsedReq.email) {
      throw createHttpError(400, null, "Email is not supplied");
    }
    if (!parsedReq.phone) {
      throw createHttpError(400, null, "Phone number is not supplied");
    }
    if (!parsedReq.recaptchaToken) {
      throw createHttpError(400, null, "Recaptcha token is not supplied");
    }

    await GSheetService.AppendContact(parsedReq);
    res.status(200).json({
      message: "Successfully added row",
    });
  } catch (e) {
    if (isHttpError(e)) {
      return res.status(e.status).json({
        error: e.error,
        message: e.message,
      });
    }
    res.status(500).json({
      error: e,
      message: "Internal server error",
    });
  }
};

export default {
  AppendContact,
};

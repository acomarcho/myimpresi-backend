import { AppendContactRequest } from "@constants/requests/gsheet";
import { serviceAccountAuth } from "@utils/gsheet";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { createHttpError } from "@utils/error";
import axios from "axios";
import { RecaptchaResponse } from "@constants/responses";

const AppendContact = async (req: AppendContactRequest) => {
  const response = await axios.put(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      secret: process.env.RECAPTCHA_SECRET_KEY || "",
      response: req.recaptchaToken,
    }
  );
  const recaptchaResponse: RecaptchaResponse = response.data;

  console.log(recaptchaResponse);

  if (!recaptchaResponse.success) {
    throw createHttpError(401, null, "Invalid reCAPTCHA token");
  }

  const spreadsheetId = process.env.SPREADSHEET_ID;

  if (!spreadsheetId) {
    throw createHttpError(
      500,
      null,
      "Missing spreadsheet configuration not yet enabled"
    );
  }

  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];

  await sheet.addRow([
    new Date().toISOString(),
    req.name,
    req.email,
    req.phone,
    req.city,
  ]);
};

export default {
  AppendContact,
};

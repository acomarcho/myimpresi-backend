import { AppendContactRequest } from "@constants/requests/gsheet";
import { serviceAccountAuth } from "@utils/gsheet";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { createHttpError } from "@utils/error";

const AppendContact = async (req: AppendContactRequest) => {
  const spreadsheetId = process.env.SPREADSHEET_ID;

  if (!spreadsheetId) {
    throw createHttpError(
      500,
      "",
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

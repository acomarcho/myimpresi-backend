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
  const sheet = doc.sheetsByIndex[0];

  await sheet.addRow({
    Timestamp: new Date().toISOString(),
    Nama: req.name,
    Email: req.email,
    "No HP": req.phone,
    Kota: req.city,
  });
};

export default {
  AppendContact,
};

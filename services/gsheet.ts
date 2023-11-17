import { AppendContactRequest } from "@constants/requests/gsheet";
import { serviceAccountAuth } from "@utils/gsheet";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { createHttpError } from "@utils/error";
import axios from "axios";
import { RecaptchaResponse } from "@constants/responses";
import nodemailer from "nodemailer";

const AppendContact = async (req: AppendContactRequest) => {
  const response = await axios.put(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.recaptchaToken}`
  );
  const recaptchaResponse: RecaptchaResponse = response.data;

  if (!recaptchaResponse.success) {
    throw createHttpError(401, recaptchaResponse, "Invalid reCAPTCHA token");
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

  await sendEmail(req.name, req.email, req.phone, req.city);
};

const sendEmail = async (
  name: string,
  email: string,
  phone: string,
  city: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    to: "impresibusiness@gmail.com",
    subject: "[MyImpresi] Ada yang baru menghubungi! Yuk, cek!",
    html: `
    <h1>Data penghubung</h1>
    <p>Nama: ${name}</p>
    <p>Email: ${email}</p>
    <p>Nomor HP: ${phone}</p>
    <p>Kota: ${city}</p>
    <br />
    <p>Untuk data lebih lengkap, silakan lihat sheets, ya!</p>
    `,
  });
};

export default {
  AppendContact,
};

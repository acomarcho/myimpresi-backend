import express from "express";
import GSheetController from "@controllers/gsheet";

import bodyParser from "body-parser";

const router = express.Router();

// POST /gsheet/contact
router.post("/contact", bodyParser.json(), GSheetController.AppendContact);

export default router;

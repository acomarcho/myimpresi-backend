import express from "express";
import EventController from "@controllers/event";
import bodyParser from "body-parser";

import { checkApiKey } from "../middlewares/api-key";

const router = express.Router();

// GET /event
router.get("/", EventController.FindAllEvents);
// POST /event
router.post("/", checkApiKey, bodyParser.json(), EventController.SaveEvent);

export default router;

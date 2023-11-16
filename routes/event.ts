import express from "express";
import EventController from "@controllers/event";
import bodyParser from "body-parser";

const router = express.Router();

// GET /event
router.get("/", EventController.FindAllEvents);
// POST /event
router.post("/", bodyParser.json(), EventController.SaveEvent);

export default router;

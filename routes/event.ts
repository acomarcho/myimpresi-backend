import express from "express";
import EventController from "@controllers/event";

const router = express.Router();

// GET /event
router.get("/", EventController.FindAllEvents);

export default router;

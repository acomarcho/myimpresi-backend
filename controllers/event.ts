import EventService from "@services/event";
import { createHttpError, handleError } from "@utils/error";
import { Request, Response } from "express";
import { SaveEventRequest } from "@constants/requests";

const FindAllEvents = async (req: Request, res: Response) => {
  try {
    const data = await EventService.FindAllEvents();
    res.status(200).json(data);
  } catch (e) {
    handleError(e, res);
  }
};

const SaveEvent = async (req: Request, res: Response) => {
  try {
    const { name }: SaveEventRequest = req.body;

    if (!name) {
      throw createHttpError(400, null, "No name supplied");
    }

    const newEvent = await EventService.SaveEvent(name);

    res.status(200).json({
      data: newEvent,
    });
  } catch (e) {
    handleError(e, res);
  }
};

export default {
  FindAllEvents,
  SaveEvent,
};

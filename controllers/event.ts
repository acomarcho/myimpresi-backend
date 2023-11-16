import EventService from "@services/event";
import { handleError } from "@utils/error";
import { Request, Response } from "express";

const FindAllEvents = async (req: Request, res: Response) => {
  try {
    const data = await EventService.FindAllEvents();
    res.status(200).json(data);
  } catch (e) {
    handleError(e, res);
  }
};

export default {
  FindAllEvents,
};

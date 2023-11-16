import EventModel from "@models/event";
import { Event } from "@prisma/client";

const FindAllEvents = async () => {
  const events = await EventModel.FindAllEvents();

  return {
    events,
  };
};

const SaveEvent = async (name: string) => {
  const eventToAdd: Event = {
    id: "",
    name: name,
    rank: null,
  };

  const newEvent = await EventModel.SaveEvent(eventToAdd);
  return newEvent;
};

export default {
  FindAllEvents,
  SaveEvent,
};

import EventModel from "@models/event";

const FindAllEvents = async () => {
  const events = await EventModel.FindAllEvents();

  return {
    events,
  };
};

export default {
  FindAllEvents,
};

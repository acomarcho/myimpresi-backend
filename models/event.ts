import prisma from "@utils/prisma";

import { redisClient } from "@utils/redis";
import { Event } from "@prisma/client";

const redisKeys = {
  allEvents: "events:all",
};

const FindAllEvents = async () => {
  const unparsedEvents = await redisClient.get(redisKeys.allEvents);
  if (unparsedEvents) {
    const events: Event[] = JSON.parse(unparsedEvents);
    return events;
  }

  const events = await prisma.event.findMany({
    orderBy: {
      rank: {
        sort: "asc",
        nulls: "last",
      },
    },
  });
  await redisClient.setEx(redisKeys.allEvents, 300, JSON.stringify(events));
  return events;
};

const SaveEvent = async (event: Event) => {
  const newEvent = await prisma.event.create({
    data: {
      name: event.name,
    },
  });

  return newEvent;
};

export default {
  FindAllEvents,
  SaveEvent,
};

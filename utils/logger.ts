import pino from "pino";

export const logger = pino(
  {
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.destination(`${__dirname}/../../logs/app.log`)
);

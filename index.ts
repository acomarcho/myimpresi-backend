import "module-alias/register";
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import CategoryRouter from "@routes/category";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(rateLimit({ windowMs: 1000 * 60, limit: 100 }));

app.use("/category", CategoryRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

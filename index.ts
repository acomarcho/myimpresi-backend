import "module-alias/register";
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

import CategoryRouter from "@routes/category";

dotenv.config();

const app: Express = express();
app.use(cors());

app.use("/category", CategoryRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

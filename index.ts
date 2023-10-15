import "module-alias/register";
import express, { Express } from "express";
import dotenv from "dotenv";

import CategoryRouter from "@routes/category";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use("/category", CategoryRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

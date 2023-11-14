import "module-alias/register";
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import CategoryRouter from "@routes/category";
import BannerRouter from "@routes/banner";
import SubcategoryRouter from "@routes/subcategory";
import ProductRouter from "@routes/product";
import ArticleRouter from "@routes/article";
import GSheetRouter from "@routes/gsheet";

dotenv.config();

const app: Express = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(rateLimit({ windowMs: 1000 * 60, limit: 100 }));

app.use("/category", CategoryRouter);
app.use("/banner", BannerRouter);
app.use("/subcategory", SubcategoryRouter);
app.use("/product", ProductRouter);
app.use("/article", ArticleRouter);
app.use("/gsheet", GSheetRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

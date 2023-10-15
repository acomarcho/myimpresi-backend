import CategoryService from "@services/category";

import { Request, Response } from "express";

const FindAllCategories = async (req: Request, res: Response) => {
  try {
    const data = await CategoryService.FindAllCategories();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).send("Something wrong happened!");
  }
};

export default {
  FindAllCategories,
};

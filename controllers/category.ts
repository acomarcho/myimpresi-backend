import { Request, Response } from "express";

const FindAllCategories = async (req: Request, res: Response) => {
  try {
    res.send("OK!");
  } catch (e) {
    res.status(500).send("Something wrong happened!");
  }
};

export default {
  FindAllCategories,
};

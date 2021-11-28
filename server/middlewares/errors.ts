import chalk from "chalk";
import debug from "debug";
import { Request, Response } from "express";
import IError from "../../interfaces/IError";

export const notFoundErrorHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generalErrorHandler = (
  error: IError,
  req: Request,
  res: Response
) => {
  if (error.statusCode === 400) {
    error.message = "Bad request";
    error.code = 400;
  }
  debug(chalk.red("Some error happens: ", error.message));
  const message = error.code ? error.message : "General error";
  res.status(error.code || 500).json({ error: message });
};

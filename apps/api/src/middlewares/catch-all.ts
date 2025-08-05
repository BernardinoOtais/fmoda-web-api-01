import { ApiResponseBody } from "@utils/api-response-body";
import HttpStatusCode from "@utils/http-status-code";

import type { Request, Response, NextFunction } from "express";

export const catchAll = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const resBody = new ApiResponseBody<null>();
  resBody.error = {
    code: HttpStatusCode.NOT_FOUND,
    message: "Route Not Found",
  };

  res.status(HttpStatusCode.NOT_FOUND).json(resBody);
  next();
};

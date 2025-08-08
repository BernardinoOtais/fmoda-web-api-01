import { ResponseHandler } from "@utils/api-response-body";
import { ZodError } from "zod";

import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

function parseZodErrors(errors: ZodError) {
  return errors.issues.map((err) => `${err.path.join(".")}: ${err.message}`);
}

export function validaSchema(
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate =
        source === "body"
          ? req.body
          : source === "query"
            ? req.query
            : req.params;

      schema.parse(dataToValidate);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = parseZodErrors(error);
        const resBody = ResponseHandler.InvalidBody(
          `Validation Error: ${errors.join("; ")}`
        );
        res.status(resBody.error!.code).json(resBody);
      } else {
        const resBody = ResponseHandler.BadRequest(
          "Unexpected validation error"
        );
        res.status(resBody.error!.code).json(resBody);
      }
    }
  };
}

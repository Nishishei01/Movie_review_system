import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import _ from "lodash"
import jwt from "jsonwebtoken";
import { JwtUtils } from "../auth/auth.utils";

type Path = "body" | "query" | "params"

export type SchemaType = z.ZodType<any, any, any>

const handleError = (error: any) => {
  if (error instanceof z.ZodError) {
    return error.issues
  }
}

export const Middlewares = {
  validatorAsyncInput: <T extends SchemaType> (
    schema: z.output<T>,
    path: Path = "body",
    isUpdate: Boolean = true
  ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = _.get(req, path)
        const value = await schema.parseAsync(data)
        if(isUpdate) {
          req.body = value as (Record<string, unknown>)
        }
        next()
      } catch (error) {
        res.status(400).json({ error: handleError(error)})
      }
    }
  },
}
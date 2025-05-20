import { NextFunction, Request, Response } from "express";
import { prisma } from "../../database/src/cilent"
import { ValidateCreateTest } from "./test.validator";

export default {
  createTest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as ValidateCreateTest

      const result = await prisma.$transaction(async (tx) => {
        const createdTest = await tx.test.create({
          data: {
            name: name
          }
        })

        return { createdTest } 
      })

      res.status(201).json({ result })
    } catch (error) {
      next(error)
    }
  },
  getAllTest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const getTest = await tx.test.findMany()

        return getTest
      })

      res.status(200).json({ result })
    } catch (error) {
      next(error)
    }
  }

}

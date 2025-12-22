import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/src/cilent";
import { ValidateCreateLike } from "./like.validator";

export default {
  createLike: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postID } = req.body as ValidateCreateLike
      const userID = res.locals.user.id
      
      const result = await prisma.like.create({
        data: {
          postID,
          userID
        }
      })
      
      res.status(200).json({ message: "Create successfully.", result })
    } catch (error) {
      next(error)
    }
  },
  deleteLike: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await prisma.like.delete({
        where: { id }
      })

      res.status(200).json({ message: "Delete successfully.", result })
    } catch (error) {
      next(error)
    }
  }
}
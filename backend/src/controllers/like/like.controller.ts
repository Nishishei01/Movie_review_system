import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/src/cilent";
import { ValidateCreateLike } from "./like.validator";

import { io } from "../../index";

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
      
      io.emit("like:created", result)
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

      io.emit("like:deleted", result)
      res.status(200).json({ message: "Delete successfully.", result })
    } catch (error) {
      next(error)
    }
  }
}
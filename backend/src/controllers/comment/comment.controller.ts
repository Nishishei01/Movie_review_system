import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client"
import { prisma } from "../../database/src/cilent"
import { UtilsHelpers } from "../../helpers/helper";
import { ValidateCreateComment } from "./comment.validator";

export default {
  createComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, postID } = req.body as ValidateCreateComment
      const userID = res.locals.user.id
      
      const result = await prisma.$transaction (async (tx) => {
        const createdComment = await tx.comment.create({
          data: {
            comment,
            postID,
            userID
          }
        })
        return createdComment
      })
      res.status(200).json({ message: "Create comment successfully.", result })
    } catch (error) {
      next(error)
    }
  },
  // getAllComment: async (req: Request, res: Response, next: NextFunction) => {

  // },
  getByIdComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let queryList: Prisma.InputJsonValue[] = []

      const { id } = req.params

      if (id) {
        queryList.push(
          {
            $match: {
              _id: { $oid: id }
            }
          }
        )
      }
      
      const result = await prisma.comment.aggregateRaw({
        pipeline: [
          ...queryList
        ]
      })

      UtilsHelpers.convertFieldList(result)

      res.status(200).json({ result })
    } catch (error) {
      next(error)
    }
  },
  updateComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { id } = req.params
    const { comment } = req.body
    const result = await prisma.comment.update({
        where: { id },
        data: {
          comment
        }
    })

    res.status(200).json({ message: "Update successfully.", result })
    } catch (error) {
      next(error)
    }
  },
  deleteComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await prisma.comment.delete({
        where: { id }
      })

      res.status(200).json({ message: "Delete successfully.", result})
    } catch (error) {
      next(error)
    }
  }
}
import express from "express"
import Controller from "./comment.controller"
import { Middlewares } from "../utils/middleware"
import ValidateComment from "./comment.validator"

const router = express.Router()

router.post(
  "/",
  Middlewares.validatorAsyncInput(ValidateComment.validateCreateComment),
  Controller.createComment
)

router.put(
  "/:id",
  Middlewares.validatorAsyncInput(ValidateComment.validateUpdateComment),
  Controller.updateComment
)

router.get(
  "/:id",
  Controller.getByIdComment
)

router.delete(
  "/:id",
  Controller.deleteComment
)

export default router
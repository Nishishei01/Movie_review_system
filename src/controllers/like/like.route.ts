import express from "express"
import Controller from "./like.controller"
import { Middlewares } from "../utils/middleware"
import ValidateLike from "./like.validator"

const router = express.Router()

router.post(
  "/",
  Middlewares.validatorAsyncInput(ValidateLike.validateCreateLike),
  Controller.createLike
)

router.delete(
  "/:id",
  Controller.deleteLike
)

export default router
import express from "express"
import { Middlewares } from "../utils/middleware"
import ValidatePost from "./post.validator"
import Controller from "./post.controller"

const router = express.Router()

router.post(
  '/',
  Middlewares.validatorAsyncInput(ValidatePost.validateCreatePost),
  Controller.createPost
)

router.get(
  '/:id',
  Controller.getByIdPost
)

router.get(
  '/',
  Controller.getAllPost
)

router.get(
  '/user/:id',
  Controller.getPostByUserId
)

router.put(
  '/:id',
  Middlewares.validatorAsyncInput(ValidatePost.validateUpdatePost),
  Controller.updatedPost
)

router.delete(
  '/:id',
  Controller.deletedPost
)

export default router
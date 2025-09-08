import express from "express";
import Controller from "./auth.controller"
import { Middlewares } from "../utils/middleware";
import AuthValidator from "./auth.validator";

const router = express.Router()

router.post(
  '/register',
  Middlewares.validatorAsyncInput(AuthValidator.validateRegister),
  Controller.register
)

router.post(
  '/login',
  Middlewares.validatorAsyncInput(AuthValidator.validateLogin),
  Controller.login
)

router.get(
  '/refreshToken',
  Controller.refreshToken
)

export default router


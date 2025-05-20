import express from "express";
import Controller from "../../controllers/testzod/test.controller"
import { Middlewares } from "../utils/middleware";
import TestValidator from "./test.validator";

const router = express.Router()

router.post(
  '/add',
  Middlewares.validatorAsyncInput(TestValidator.validateCreateTest),
  Controller.createTest
)

router.get(
  '/',
  Controller.getAllTest
)

export default router


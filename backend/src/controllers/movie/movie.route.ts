import express from "express"
import Controller from "./movie.controller"
import { Middlewares } from "../utils/middleware"
import ValidateLike from "./movie.controller"

const router = express.Router()

router.get(
  '/search',
  Controller.searchMovie
)

export default router
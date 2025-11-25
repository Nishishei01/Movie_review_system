import express, { Router } from "express";
import dotenv from "dotenv";
import { prisma } from "./database/src/cilent"
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./controllers/auth/auth.route"
import { JwtUtils } from "./controllers/auth/auth.utils";
import ValidateAuth from "./controllers/auth/auth.validator";
import postRoute from "./controllers/post/post.route"
import commentRoute from "./controllers/comment/comment.route"
import likeRoute from "./controllers/like/like.route"

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = [
  "http://localhost:3000"
]

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, 
  })
)

const router = Router();
app.use(router);

router.use("/auth", authRoute);
router.use(ValidateAuth.jwtProtect);
router.use("/post", postRoute)
router.use("/comment", commentRoute)
router.use("/like", likeRoute)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

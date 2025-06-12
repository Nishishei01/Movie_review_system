import express, { Router } from "express";
import dotenv from "dotenv";
import { prisma } from "./database/src/cilent"
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

import authRoute from "./controllers/auth/auth.route"
import { JwtUtils } from "./controllers/auth/auth.utils";
import ValidateAuth from "./controllers/auth/auth.validator";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const router = Router();
app.use(router);

router.use("/auth", authRoute);
router.use(ValidateAuth.jwtProtect);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

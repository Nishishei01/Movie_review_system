import express, { Router } from "express";
import dotenv from "dotenv";
import { prisma } from "./database/src/cilent"
import bodyParser from 'body-parser';

import testRoute from "./controllers/testzod/test.route"

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = Router();
app.use(router);

router.use("/test", testRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

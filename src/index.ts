import express from "express";
import dotenv from "dotenv";
import { prisma } from "./database/src/cilent"


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello");
  console.log("Res sent");
})

app.post("/test", async (req, res) => {
  try {
    const created = await prisma.test.create({
      data: {
        name: "test"
      }
    })

    res.status(201).json({ created })
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

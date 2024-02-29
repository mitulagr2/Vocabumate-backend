import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

import generateContent from "./generate";

app.get("/define", async (req: Request, res: Response) => {
  const word = req.query.word;
  if (word && typeof word === "string") {
    const prompt = `Provide an overview of the word '${word}'.`;
    const output = await generateContent(prompt);
    res.json(output);
  }

  res.status(400).json({
    status: 400,
    message: "Please provide an appropriate word query.",
  });
});

app.get("/ping", (_req: Request, res: Response) => {
  res.json("pong");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

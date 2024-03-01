import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import { generateContent } from "./gemini";
import { getAndIncWord, addWord } from "./cockroachdb";

app.get("/define", async (req: Request, res: Response) => {
  const word = req.query.word;
  if (!word || typeof word !== "string") {
    return res.status(400).json({
      status: 400,
      message: "Please provide an appropriate word query.",
    });
  }

  try {
    const saved = await getAndIncWord(word);
    res.json(saved);
  } catch (PrismaClientKnownRequestError) {
    const prompt = `Provide an overview of the word '${word}'.`;
    const output = await generateContent(prompt);
    const newWord = await addWord({ word, meaning: output });
    res.json(newWord);
  }
});

app.get("/ping", (_req: Request, res: Response) => {
  res.json("pong");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

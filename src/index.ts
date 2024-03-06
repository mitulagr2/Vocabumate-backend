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

let dailyWord: string;

const updateDailyWord = async () => {
  const res = await fetch("https://api.api-ninjas.com/v1/randomword", {
    headers: {
      "X-Api-Key": process.env.RANDOM_WORD_API_KEY,
    },
  });

  dailyWord = await res.json();

  setTimeout(updateDailyWord, 1000 * 3600 * 24);
};
updateDailyWord();

app.get("/define", async (req: Request, res: Response) => {
  let word = req.query.word;
  if (!word || typeof word !== "string") {
    return res.status(400).json({
      status: 400,
      message: "Please provide an appropriate word query.",
    });
  }

  word = word
    .replace(/^[^a-zA-Z ]*$/, "")
    .trim()
    .replace(/\\s+/, " ")
    .toLowerCase();

  try {
    const saved = await getAndIncWord(word);
    res.json(saved);
  } catch (PrismaClientKnownRequestError) {
    const prompt = `Provide an overview of the word '${word}'.`;
    const output = await generateContent(prompt);
    const newWord = await addWord({ word, meaning: output });
    res.json(newWord);
  }
  // TODO: handle other errors
});

app.get("/daily", (_req: Request, res: Response) => {
  res.json(dailyWord);
});

app.get("/ping", (_req: Request, res: Response) => {
  res.json("pong");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAndIncWord = async (query: string) => {
  const word = await prisma.word.update({
    where: {
      word: query,
    },
    data: {
      popularity: {
        increment: 1,
      },
    },
  });

  console.log(word);
  return word;
};

export const addWord = async (data: { word: string; meaning: string }) => {
  const word = await prisma.word.create({
    data: {
      word: data.word,
      meaning: data.meaning,
      popularity: 1,
    },
  });

  console.log(word);
  return word;
};

// prisma.$on("beforeExit", async () => {
//   console.log("beforeExit hook");
// });

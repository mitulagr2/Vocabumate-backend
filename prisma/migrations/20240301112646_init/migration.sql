-- CreateTable
CREATE TABLE "Word" (
    "word" STRING NOT NULL,
    "meaning" STRING NOT NULL,
    "popularity" INT4 NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("word")
);

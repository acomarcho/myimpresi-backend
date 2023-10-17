-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "imagePath" TEXT NOT NULL,
    "rank" INTEGER,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

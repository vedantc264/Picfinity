-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "authorId" INTEGER NOT NULL,
    "photoId" SERIAL NOT NULL,
    "photo_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "saved" INTEGER[],

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("photoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_authorId_key" ON "Photo"("authorId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

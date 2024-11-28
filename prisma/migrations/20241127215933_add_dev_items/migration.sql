-- CreateTable
CREATE TABLE "DevItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "adminNotes" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCompleted" DATETIME
);

-- CreateTable
CREATE TABLE "DevItemVote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "devItemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DevItemVote_devItemId_fkey" FOREIGN KEY ("devItemId") REFERENCES "DevItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DevItemVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DevItemComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "devItemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DevItemComment_devItemId_fkey" FOREIGN KEY ("devItemId") REFERENCES "DevItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DevItemComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DevItemComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DevItemComment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DevItemVote_devItemId_userId_key" ON "DevItemVote"("devItemId", "userId");

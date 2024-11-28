/*
  Warnings:

  - You are about to drop the column `adminNotes` on the `DevItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DevItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "developerNotes" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCompleted" DATETIME
);
INSERT INTO "new_DevItem" ("dateCompleted", "dateCreated", "details", "id", "status", "title", "type", "views") SELECT "dateCompleted", "dateCreated", "details", "id", "status", "title", "type", "views" FROM "DevItem";
DROP TABLE "DevItem";
ALTER TABLE "new_DevItem" RENAME TO "DevItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

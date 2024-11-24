/*
  Warnings:

  - You are about to alter the column `last_login` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "auth_type" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "active" INTEGER NOT NULL DEFAULT 1,
    "current_active_company_id" INTEGER,
    "notification_preferences" TEXT,
    "voting_rights" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "password" TEXT,
    "secret_question_1_id" INTEGER,
    "secret_answer_1" TEXT,
    "secret_question_2_id" INTEGER,
    "secret_answer_2" TEXT,
    "secret_question_3_id" INTEGER,
    "secret_answer_3" TEXT,
    "password_expiration" DATETIME,
    "questions_expiration" DATETIME,
    "last_login" DATETIME,
    CONSTRAINT "User_secret_question_3_id_fkey" FOREIGN KEY ("secret_question_3_id") REFERENCES "SecretQuestion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_secret_question_2_id_fkey" FOREIGN KEY ("secret_question_2_id") REFERENCES "SecretQuestion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_secret_question_1_id_fkey" FOREIGN KEY ("secret_question_1_id") REFERENCES "SecretQuestion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("active", "auth_type", "avatar", "created_at", "current_active_company_id", "email", "id", "is_active", "last_login", "name", "notification_preferences", "password", "password_expiration", "questions_expiration", "role", "secret_answer_1", "secret_answer_2", "secret_answer_3", "secret_question_1_id", "secret_question_2_id", "secret_question_3_id", "updated_at", "voting_rights") SELECT "active", "auth_type", "avatar", "created_at", "current_active_company_id", "email", "id", "is_active", "last_login", "name", "notification_preferences", "password", "password_expiration", "questions_expiration", "role", "secret_answer_1", "secret_answer_2", "secret_answer_3", "secret_question_1_id", "secret_question_2_id", "secret_question_3_id", "updated_at", "voting_rights" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

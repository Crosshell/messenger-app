/*
  Warnings:

  - You are about to drop the column `updated_at` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `_UserChats` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('DIRECT', 'GROUP');

-- DropForeignKey
ALTER TABLE "_UserChats" DROP CONSTRAINT "_UserChats_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserChats" DROP CONSTRAINT "_UserChats_B_fkey";

-- AlterTable
ALTER TABLE "attachments" ALTER COLUMN "message_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "updated_at",
ADD COLUMN     "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "ChatType" NOT NULL DEFAULT 'DIRECT';

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "status",
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_UserChats";

-- DropEnum
DROP TYPE "MessageStatus";

-- CreateTable
CREATE TABLE "chats_members" (
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "chats_members_pkey" PRIMARY KEY ("user_id","chat_id")
);

-- AddForeignKey
ALTER TABLE "chats_members" ADD CONSTRAINT "chats_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats_members" ADD CONSTRAINT "chats_members_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

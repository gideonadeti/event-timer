/*
  Warnings:

  - The values [repeat] on the enum `Types` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Types_new" AS ENUM ('countUp', 'countdown');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "Types_new" USING ("type"::text::"Types_new");
ALTER TYPE "Types" RENAME TO "Types_old";
ALTER TYPE "Types_new" RENAME TO "Types";
DROP TYPE "Types_old";
COMMIT;

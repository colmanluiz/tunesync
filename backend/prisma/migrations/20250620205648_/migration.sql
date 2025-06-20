-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "collaborative" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false;

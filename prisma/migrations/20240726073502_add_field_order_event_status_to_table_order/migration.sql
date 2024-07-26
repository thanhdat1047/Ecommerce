-- AlterTable
ALTER TABLE "order" ADD COLUMN     "status" "OrderEventStatus" NOT NULL DEFAULT 'PENDING';

const cron = require("node-cron");
const prisma = require("../config/db");

const startOverdueCron = () => {
  // Run every midnight: '0 0 * * *'
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running overdue asset check cron job...");

    try {
      const now = new Date();

      const overdueAllocations = await prisma.assetAllocation.findMany({
        where: {
          status: "ACTIVE",
          expectedReturnDate: {
            lt: now,
          },
        },
        include: {
          asset: { select: { name: true, assetTag: true } },
        },
      });

      console.log(`Found ${overdueAllocations.length} overdue allocations.`);

      if (overdueAllocations.length === 0) return;

      await prisma.$transaction(async (tx) => {
        for (const alloc of overdueAllocations) {
          await tx.assetAllocation.update({
            where: { id: alloc.id },
            data: { status: "OVERDUE" },
          });

          await tx.notification.create({
            data: {
              userId: alloc.employeeId,
              title: "Asset Allocation Overdue",
              message: `Your checkout for asset ${alloc.asset.name} (${alloc.asset.assetTag}) was due on ${alloc.expectedReturnDate.toLocaleDateString()} and is now overdue. Please process a return.`,
              type: "OVERDUE_RETURN",
            },
          });
        }
      });

      console.log("⏰ Overdue asset check complete.");
    } catch (error) {
      console.error("Error running overdue asset check cron:", error);
    }
  });
};

module.exports = startOverdueCron;

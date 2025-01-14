import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const referrals = await prisma.referral.findMany({
    include: {
      referrer: true,
    },
  });

  for (const referral of referrals) {
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        referrerRankAtReferral: referral.referrer.rank || 0,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

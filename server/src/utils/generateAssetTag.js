const prisma = require("../config/db");

const generateAssetTag = async () => {
  const lastAsset = await prisma.asset.findFirst({
    orderBy: { createdAt: "desc" },
    select: { assetTag: true },
  });

  if (!lastAsset || !lastAsset.assetTag) {
    return "AF-000001";
  }

  const tagParts = lastAsset.assetTag.split("-");
  const numPart = parseInt(tagParts[1], 10);

  if (isNaN(numPart)) {
    return "AF-000001";
  }

  const nextNum = numPart + 1;
  const paddedNum = String(nextNum).padStart(6, "0");

  return `AF-${paddedNum}`;
};

module.exports = generateAssetTag;

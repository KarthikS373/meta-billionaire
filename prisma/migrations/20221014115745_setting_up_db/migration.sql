-- CreateTable
CREATE TABLE "NFT" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "stackingPrice" DOUBLE PRECISION NOT NULL,
    "totalSupply" DOUBLE PRECISION NOT NULL,
    "supply" DOUBLE PRECISION NOT NULL,
    "collectionSlug" TEXT NOT NULL,
    "collectionDescription" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "comingSoon" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFTData" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "collectionSlug" TEXT NOT NULL,
    "userPrice" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,

    CONSTRAINT "NFTData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Map" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "lng" TEXT NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mbucBalance" TEXT NOT NULL DEFAULT '',
    "isApproval" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "alreadyClaim" BOOLEAN NOT NULL,
    "authorId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "oldContract" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaffleWinner" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "winner" TEXT NOT NULL,

    CONSTRAINT "RaffleWinner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimReward" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "zip" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "clothingSize" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,

    CONSTRAINT "ClaimReward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Map_wallet_key" ON "Map"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_key" ON "User"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "RaffleWinner_productId_key" ON "RaffleWinner"("productId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("wallet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimReward" ADD CONSTRAINT "ClaimReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("wallet") ON DELETE RESTRICT ON UPDATE CASCADE;

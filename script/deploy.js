const hre = require("hardhat");

async function main() {
  const Raffle = await hre.ethers.getContractFactory("Marketplace");
  const raffle = await Raffle.deploy(
    "0xECD3c4f21DcEebC8F308aF7c3A7f1A4265BB52E9"
  );

  await raffle.deployed();

  console.log("Marketplace deployed to :" + raffle.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

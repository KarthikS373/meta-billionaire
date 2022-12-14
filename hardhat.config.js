require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("dotenv").config();
const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.14",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  paths: {
    artifacts: "./artifacts",
  },
  //! defaultNetwork: "rinkeby",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      //chainId: 1337,
      //! chainId: 1,
    },
    //! rinkeby: {
    //!   url: API_URL,
    //!   accounts: [`0x${PRIVATE_KEY}`],
    //! },
  },
  gasReporter: {
    currency: "EUR",
    gasPrice: 21,
    enabled: true,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

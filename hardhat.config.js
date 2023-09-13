require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-ethers")
require("@nomicfoundation/hardhat-chai-matchers")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}

// to deploy npx hardhat run scripts/deploy.js --network <network name>

require("dotenv").config()

async function main() {
  const VendingMachine = await hre.ethers.getContractFactory("VendingMachine")
  console.log("Deploying contract...")

  const vendingMachine = await VendingMachine.deploy()
  await vendingMachine.deployed()
  console.log(`Deployed contract to: ${vendingMachine.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

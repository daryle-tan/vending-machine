const { ethers } = require("hardhat")
const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

describe("VendingMachine", function () {
  async function deployVendingMachineFixture() {
    const VendingMachineFactory = await ethers.getContractFactory(
      "VendingMachine",
    )
    const vendingMachine = await VendingMachineFactory.deploy()
    const [owner, addr1] = await ethers.getSigners()

    await vendingMachine.deployed()
    return { vendingMachine, owner, addr1 }
  }

  it("Should reduce quantity of the snack and increment the balance of contract", async function () {
    const { vendingMachine, addr1 } = await loadFixture(
      deployVendingMachineFixture,
    )
    const initialBalance = await vendingMachine.getBalance()
    await vendingMachine
      .connect(addr1)
      .purchaseSnack("drinks", 1, ethers.utils.parseEther("0.002"), {
        value: ethers.utils.parseEther("0.002"),
      })
    const finalBalance = await vendingMachine.getBalance()
    expect(finalBalance).to.equal(
      initialBalance.add(ethers.utils.parseEther("0.002")),
    )
  })

  it("Should fail if insufficient funds are sent", async function () {
    const { vendingMachine, addr1 } = await loadFixture(
      deployVendingMachineFixture,
    )
    const insufficientFunds = await vendingMachine
      .connect(addr1)
      .purchaseSnack("drinks", 1, ethers.utils.parseEther("0.002"), {
        value: ethers.utils.parseEther("0.003"),
      })

    expect(insufficientFunds).to.not.be.revertedWith(
      "Declined! Insufficient payment amount.",
    )
  })

  it("Should fail if invalid snack is selected", async function () {
    const { vendingMachine, addr1 } = await loadFixture(
      deployVendingMachineFixture,
    )
    // Call purchaseSnack with a snack that does not exist in the inventory
    const nonExistentSnack = await vendingMachine
      .connect(addr1)
      .purchaseSnack("drinks", 1, ethers.utils.parseEther("0.002"), {
        value: ethers.utils.parseEther("0.002"),
      })

    expect(nonExistentSnack).to.not.be.revertedWith("Invalid snack selected")
  })

  it("Should fail if trying to purchase more snacks than available", async function () {
    const { vendingMachine, addr1 } = await loadFixture(
      deployVendingMachineFixture,
    )
    const notEnoughSnacks = await vendingMachine
      .connect(addr1)
      .purchaseSnack("drinks", 20, ethers.utils.parseEther("0.04"), {
        value: ethers.utils.parseEther("0.04"),
      })
    expect(notEnoughSnacks).to.not.be.revertedWith(
      "We've sold out of this item!",
    )
  })

  it("Should withdraw the funds from the vending machine", async function () {
    const { vendingMachine, owner } = await loadFixture(
      deployVendingMachineFixture,
    )
    await expect(vendingMachine.connect(owner).withdraw())
  })

  it("Should return the balance of the vending machine", async function () {
    const { vendingMachine, owner } = await loadFixture(
      deployVendingMachineFixture,
    )
    const contractBalanceBefore = await vendingMachine.getBalance()
    const amountToSend = ethers.utils.parseEther("1.0")

    // Send some funds to the contract
    await owner.sendTransaction({
      to: vendingMachine.address,
      value: amountToSend,
    })

    const contractBalanceAfter = await vendingMachine.getBalance()
    expect(contractBalanceAfter).to.equal(
      contractBalanceBefore.add(amountToSend),
    )
  })

  it("Should return snack quantity and price", async function () {
    const { vendingMachine } = await loadFixture(deployVendingMachineFixture)
    const [quantity, price] = await vendingMachine.getSnack("chips")
    // console.log("Quantity: ", quantity.toString())
    // console.log("Price: ", ethers.utils.formatEther(price))
    expect(quantity).to.equal(20)
    expect(price).to.equal(ethers.utils.parseEther("0.001"))
  })
})

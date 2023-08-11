const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("VendingMachine", function () {
  let VendingMachineFactory, vendingMachine
  beforeEach(async function () {
    VendingMachineFactory = await ethers.getContractFactory("VendingMachine")
    ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    vendingMachine = await VendingMachineFactory.deploy({
      value: ethers.utils.parseEther("1.0"),
    })
    await vendingMachine.deployed()
  })

  it("Should reduce quantity of the snack and increment the balance of contract", async function () {
    const initialBalance = await vendingMachine.getBalance()
    await vendingMachine
      .connect(addr1)
      .purchaseSnack("chips", 1, { value: ethers.utils.parseEther("0.001") })
    const finalBalance = await vendingMachine.getBalance()
    expect(finalBalance).to.equal(
      initialBalance.add(ethers.utils.parseEther("0.001")),
    )
  })

  it("Should fail if insufficient funds are sent", async function () {
    await expect(
      vendingMachine.connect(addr1).purchaseSnack("chips", 1, {
        value: ethers.utils.parseEther("0.0005"),
      }),
    ).to.be.revertedWith("Declined! Insufficient payment amount.")
  })

  it("Should fail if invalid snack is selected", async function () {
    await expect(
      vendingMachine.connect(addr1).purchaseSnack("invalid", 1, {
        value: ethers.utils.parseEther("0.001"),
      }),
    ).to.be.revertedWith("Invalid snack selected")
  })

  it("Should fail if trying to purchase more snacks than available", async function () {
    await expect(
      vendingMachine.connect(addr1).purchaseSnack("chips", 21, {
        value: ethers.utils.parseEther("0.021"),
      }),
    ).to.be.revertedWith("We've sold out of this item!")
  })

  it("Should withdraw the funds from the vending machine", async function () {
    await expect(vendingMachine.connect(owner).withdraw())
  })

  it("Should return the balance of the vending machine", async function () {
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
})

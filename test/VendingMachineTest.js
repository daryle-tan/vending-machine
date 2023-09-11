const { ethers } = require("hardhat")
const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

describe("VendingMachine", function () {
  async function deployVendingMachineFixture() {
    const VendingMachineFactory = await ethers.getContractFactory(
      "VendingMachine",
    )
    const vendingMachine = await VendingMachineFactory.deploy()
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners()

    await vendingMachine.deployed()
    return { vendingMachine, owner, addr1, addr2, ...addrs }
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
    const { vendingMachine, owner, addr1 } = await loadFixture(
      deployVendingMachineFixture,
    )
    await expect(
      vendingMachine
        .connect(addr1)
        .purchaseSnack("drinks", 1, ethers.utils.parseEther("0.002"), {
          value: ethers.utils.parseEther("0.0005"),
        }),
    ).to.be.revertedWith("Declined! Insufficient payment amount.")
  })

  it("Should fail if invalid snack is selected", async function () {
    const { vendingMachine, owner, addr1, addr2 } = await loadFixture(
      deployVendingMachineFixture,
    )
    await expect(
      vendingMachine
        .connect(addr1)
        .purchaseSnack("drinks", 1, ethers.utils.parseEther("0"), {
          value: ethers.utils.parseEther("0.002"),
        }),
    ).to.be.revertedWith("Invalid snack selected")
  })

  it("Should fail if trying to purchase more snacks than available", async function () {
    const { vendingMachine, owner, addr1, addr2 } = await loadFixture(
      deployVendingMachineFixture,
    )
    await expect(
      vendingMachine
        .connect(addr1)
        .purchaseSnack("chips", 21, ethers.utils.parseEther("0.002"), {
          value: ethers.utils.parseEther("0.042"),
        }),
    ).to.be.revertedWith("We've sold out of this item!")
  })

  it("Should withdraw the funds from the vending machine", async function () {
    const { vendingMachine, owner, addr1, addr2, ...addrs } = await loadFixture(
      deployVendingMachineFixture,
    )
    await expect(vendingMachine.connect(owner).withdraw())
  })

  it("Should return the balance of the vending machine", async function () {
    const { vendingMachine, owner, addr1, addr2 } = await loadFixture(
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
    const { vendingMachine, owner, addr1, addr2 } = await loadFixture(
      deployVendingMachineFixture,
    )
    const [quantity, price] = await vendingMachine.getSnack("chips")
    // console.log("Quantity: ", quantity.toString())
    // console.log("Price: ", ethers.utils.formatEther(price))
  })
})

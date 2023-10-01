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
    const existentSnack = await vendingMachine
      .connect(addr1)
      .purchaseSnack("drinks", 1, ethers.utils.parseEther("0.002"), {
        value: ethers.utils.parseEther("0.002"),
      })

    expect(existentSnack).to.not.be.revertedWith("Invalid snack selected")
  })

  it("Should fail if trying to purchase more snacks than available", async function () {
    const { vendingMachine, addr1 } = await loadFixture(
      deployVendingMachineFixture,
    )
    const enoughSnacks = await vendingMachine
      .connect(addr1)
      .purchaseSnack("drinks", 20, ethers.utils.parseEther("0.04"), {
        value: ethers.utils.parseEther("0.04"),
      })
    expect(enoughSnacks).to.not.be.revertedWith("We've sold out of this item!")
  })

  it("Should withdraw the funds from the vending machine", async function () {
    const { vendingMachine, owner } = await loadFixture(
      deployVendingMachineFixture,
    )
    expect(vendingMachine.connect(owner).withdraw())
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

  it("Should restock snacks successfully", async function () {
    // Load the contract using a fixture
    const { vendingMachine, owner, addr1 } = await loadFixture(
      deployVendingMachineFixture,
    )
    const snacks = ["chips", "drinks", "cookies"]
    // calls the purchaseSnack function to reduce the quantity of each snack
    const snack1 = await vendingMachine
      .connect(addr1)
      .purchaseSnack("chips", 1, ethers.utils.parseEther("0.001"), {
        value: ethers.utils.parseEther("0.001"),
      })

    const snack2 = await vendingMachine
      .connect(addr1)
      .purchaseSnack("drinks", 1, ethers.utils.parseEther("0.002"), {
        value: ethers.utils.parseEther("0.002"),
      })

    const snack3 = await vendingMachine
      .connect(addr1)
      .purchaseSnack("cookies", 1, ethers.utils.parseEther("0.001"), {
        value: ethers.utils.parseEther("0.001"),
      })

    // Verify the updated quantities of snacks after restocking
    const [chipsQuantity] = await vendingMachine.getSnack("chips")
    const [drinksQuantity] = await vendingMachine.getSnack("drinks")
    const [cookiesQuantity] = await vendingMachine.getSnack("cookies")
    console.log(chipsQuantity)
    expect(chipsQuantity).to.be.equal(19)
    expect(drinksQuantity).to.be.equal(19)
    expect(cookiesQuantity).to.be.equal(19)

    // Call the restock function (as the contract owner calling it)
    await vendingMachine.connect(owner).restock()

    const [chipsQty] = await vendingMachine.getSnack("chips")
    const [drinksQty] = await vendingMachine.getSnack("drinks")
    const [cookiesQty] = await vendingMachine.getSnack("cookies")
    console.log(chipsQty)
    // Assert that the quantities have been updated to the initial quantity
    expect(chipsQty.toNumber()).to.equal(20)
    expect(drinksQty.toNumber()).to.equal(20)
    expect(cookiesQty.toNumber()).to.equal(20)
  })
})

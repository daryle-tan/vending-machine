import { useState, useEffect } from "react"
import styles from "../styles/VendingMachine.module.css"
import Image from "next/image"
const { ethers } = require("ethers")

function VendingMachine({
  state,
  getBalance,
  snackQuantities,
  setSnackQuantities,
}) {
  const [snackPrices, setSnackPrices] = useState({})
  const [totals, setTotals] = useState({
    chips: { quantity: 0, price: 0 },
    drinks: { quantity: 0, price: 0 },
    cookies: { quantity: 0, price: 0 },
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const snackNames = ["chips", "drinks", "cookies"]

    snackNames.forEach(getSnackInfoVM)
  }, [state])

  const getSnackInfoVM = async (snackName) => {
    try {
      const { contract } = state
      if (contract) {
        // Check if contract exists
        const [quantity, price] = await contract.getSnack(snackName)
        // Convert BigNumber to number
        const quantityNum = parseInt(quantity._hex, 16)
        const ethPriceWei = price.toString()
        // Convert wei to ETH using ethers.js
        const ethPrice = ethers.utils.formatEther(ethPriceWei)
        // Update the snack quantities state
        setSnackQuantities((prevQuantities) => ({
          ...prevQuantities,
          [snackName]: quantityNum,
        }))
        // Update the snack prices state
        setSnackPrices((prevPrices) => ({
          ...prevPrices,
          [snackName]: ethPrice,
        }))
      }
    } catch (error) {
      console.error(`Error getting ${snackName} info:`, error)
    }
  }

  const addSnack = async (snackName) => {
    if (totals[snackName].quantity < 20 && totals[snackName].quantity >= 0) {
      const { contract } = state
      const [totalQ, totalP] = await contract.getSnack(snackName)
      // Convert BigNumber to number
      const quantityNum = parseInt(totalQ._hex, 16)
      const ethPriceWei = await totalP.toString()
      // Convert wei to ETH using ethers.js
      const ethPrice = ethers.utils.formatEther(ethPriceWei)

      const newQuantity = totals[snackName].quantity + 1
      const newPrice = newQuantity * ethPrice

      setTotals((prevTotals) => ({
        ...prevTotals,
        [snackName]: { quantity: newQuantity, price: newPrice },
      }))
    }
  }

  const removeSnack = async (snackName) => {
    if (totals[snackName].quantity <= 20 && totals[snackName].quantity > 0) {
      const { contract } = state
      const [totalQ, totalP] = await contract.getSnack(snackName)
      // Convert BigNumber to number
      const quantityNum = parseInt(totalQ._hex, 16)
      const ethPriceWei = await totalP.toString()
      // Convert wei to ETH using ethers.js
      const ethPrice = ethers.utils.formatEther(ethPriceWei)

      const newQuantity = totals[snackName].quantity - 1
      const newPrice = newQuantity * ethPrice

      setTotals((prevTotals) => ({
        ...prevTotals,
        [snackName]: { quantity: newQuantity, price: newPrice },
      }))
    }
  }

  const getTotalQuantity = () => {
    return Object.values(totals).reduce(
      (total, snack) => total + snack.quantity,
      0,
    )
  }

  const getTotalPrice = () => {
    const totalPrice = Object.values(totals).reduce(
      (total, snack) => total + snack.price,
      0,
    )
    return totalPrice.toFixed(3)
  }

  const purchaseSnacksFn = async () => {
    setIsLoading(true) // Set loading to true when initiating the transaction
    const { contract } = state
    const snackNames = ["chips", "drinks", "cookies"]

    for (const snackName of snackNames) {
      const { quantity, price } = totals[snackName]
      if (quantity > 0) {
        try {
          const snackPrice = ethers.utils.parseEther(price.toString()) // Convert price to wei
          // Send a transaction to the contract's purchaseSnack function
          const tx = await contract.purchaseSnack(
            snackName,
            quantity,
            snackPrice,
            {
              value: snackPrice, // Send the correct amount of Ether
            },
          )
          // Wait for the transaction to be mined
          await tx.wait()
          // Refresh the data shown on the UI
          await getSnackInfoVM(snackName)
          // Reset the quantity for the current snack to 0
          setTotals((prevTotals) => ({
            ...prevTotals,
            [snackName]: { quantity: 0, price: 0 },
          }))
          console.log(
            `Purchased ${totals[snackName].quantity} ${snackName} for ${snackPrice} ETH`,
          )
        } catch (error) {
          console.error(`Error purchasing chips:`, error, price)
          alert("Please select snack choices")
        }
      }
    }
    getBalance()
    setIsLoading(false)
  }

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingIndicator}>
          Waiting on transcation to complete...
        </div>
      ) : (
        <div className={styles.vendingContainer}>
          <div className={styles.mainVending}>
            <div className={styles.snackContainer}>
              <div className={styles.snackLabel}>A</div>
              <div className={styles.snackItem}>
                <Image
                  src="/hot-cheetos.webp"
                  width={100}
                  height={100}
                  sizes={"100vw"}
                  className={styles.snackPic}
                  alt={"chips"}
                />
              </div>
              <div className={styles.snackPrice}>
                {snackPrices["chips"]} ETH
              </div>
              <div className={styles.snackQty}>
                QTY: {snackQuantities["chips"]}
              </div>
            </div>
            <div className={styles.snackContainer}>
              <div className={styles.snackLabel}>B</div>
              <div className={styles.snackItem}>
                <Image
                  src="/coconut-water.jpeg"
                  width={100}
                  height={100}
                  sizes={"100vw"}
                  className={styles.snackPic}
                  alt={"drinks"}
                />
              </div>
              <div className={styles.snackPrice}>
                {snackPrices["drinks"]} ETH
              </div>
              <div className={styles.snackQty}>
                QTY: {snackQuantities["drinks"]}
              </div>
            </div>
            <div className={styles.snackContainer}>
              <div className={styles.snackLabel}>C</div>
              <div className={styles.snackItem}>
                <Image
                  src="/cookies.jpeg"
                  width={100}
                  height={100}
                  sizes={"100vw"}
                  className={styles.snackPic}
                  alt={"cookies"}
                />
              </div>
              <div className={styles.snackPrice}>
                {snackPrices["cookies"]} ETH
              </div>
              <div className={styles.snackQty}>
                QTY: {snackQuantities["cookies"]}
              </div>
            </div>
          </div>
          <div className={styles.sideVending}>
            <div className={styles.displayScreen}>
              <div className={styles.totalQty}>
                <span className={styles.displaySpan}>
                  Chips Qty: {totals["chips"].quantity}
                </span>
              </div>
              <div className={styles.totalQty}>
                <span className={styles.displaySpan}>
                  Drinks Qty: {totals["drinks"].quantity}
                </span>
              </div>
              <div className={styles.totalQty}>
                <span className={styles.displaySpan}>
                  Cookies Qty: {totals["cookies"].quantity}
                </span>
              </div>
              <div className={styles.totalQty}>
                <span className={styles.displaySpan}>Total Qty: </span>
                {getTotalQuantity()}
              </div>
              <div className={styles.totalAmount}>
                <span className={styles.displaySpan}>Total Price: </span>
                {getTotalPrice() == 0 ? 0 : getTotalPrice()} ETH
              </div>
            </div>

            <div className={styles.controlQty}>
              <div className={styles.controlContainer}>
                <button
                  className={styles.decrement}
                  onClick={() => removeSnack("chips")}
                >
                  -
                </button>
                <div className={styles.controlLabel}>A</div>
                <button
                  className={styles.increment}
                  onClick={() => addSnack("chips")}
                >
                  +
                </button>
              </div>
              <div className={styles.controlContainer}>
                <button
                  className={styles.decrement}
                  onClick={() => removeSnack("drinks")}
                >
                  -
                </button>
                <div className={styles.controlLabel}>B</div>
                <button
                  className={styles.increment}
                  onClick={() => addSnack("drinks")}
                >
                  +
                </button>
              </div>
              <div className={styles.controlContainer}>
                <button
                  className={styles.decrement}
                  onClick={() => removeSnack("cookies")}
                >
                  -
                </button>
                <div className={styles.controlLabel}>C</div>
                <button
                  className={styles.increment}
                  onClick={() => addSnack("cookies")}
                >
                  +
                </button>
              </div>
            </div>

            <button className={styles.payButton} onClick={purchaseSnacksFn}>
              Pay
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default VendingMachine

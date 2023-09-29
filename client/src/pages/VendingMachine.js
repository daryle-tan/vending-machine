import { useState, useEffect } from "react"
import styles from "../styles/VendingMachine.module.css"
import Image from "next/image"
const { ethers } = require("ethers")

function VendingMachine({ state }) {
  const [snackQuantities, setSnackQuantities] = useState({})
  const [snackPrices, setSnackPrices] = useState({})

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

  useEffect(() => {
    const snackNames = ["chips", "drinks", "cookies"]
    snackNames.forEach(getSnackInfoVM)
  }, [state.contract])

  return (
    <>
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
              />
            </div>
            <div className={styles.snackPrice}>{snackPrices["chips"]} ETH</div>
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
              />
            </div>
            <div className={styles.snackPrice}>{snackPrices["drinks"]} ETH</div>
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
              <span className={styles.displaySpan}>Total Qty: </span>1
            </div>
            <div className={styles.totalAmount}>
              <span className={styles.displaySpan}>Total Price: </span>0.001 ETH
            </div>
          </div>

          <div className={styles.controlQty}>
            <div className={styles.controlContainer}>
              <button className={styles.decrement}>-</button>
              <div className={styles.controlLabel}>A</div>
              <button className={styles.increment}>+</button>
            </div>
            <div className={styles.controlContainer}>
              <button className={styles.decrement}>-</button>
              <div className={styles.controlLabel}>B</div>
              <button className={styles.increment}>+</button>
            </div>
            <div className={styles.controlContainer}>
              <button className={styles.decrement}>-</button>
              <div className={styles.controlLabel}>C</div>
              <button className={styles.increment}>+</button>
            </div>
          </div>

          {/* <div className={styles.Pay}> */}
          <button className={styles.payButton}>Pay</button>
          {/* </div> */}
        </div>
      </div>
    </>
  )
}

export default VendingMachine

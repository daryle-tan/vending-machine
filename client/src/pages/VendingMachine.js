import { useState, useEffect } from "react"
import styles from "../styles/VendingMachine.module.css"
import Image from "next/image"
const { ethers } = require("ethers")

function VendingMachine({ state }) {
  const [snackQuantities, setSnackQuantities] = useState({})
  const [snackPrices, setSnackPrices] = useState({})
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantityChips, setTotalQuantityChips] = useState(0)
  const [totalPriceChips, setTotalPriceChips] = useState(0)
  const [totalQuantityDrinks, setTotalQuantityDrinks] = useState(0)
  const [totalPriceDrinks, setTotalPriceDrinks] = useState(0)
  const [totalQuantityCookies, setTotalQuantityCookies] = useState(0)
  const [totalPriceCookies, setTotalPriceCookies] = useState(0)

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

  const addSnack = async (snackName) => {
    if (totalQuantity < 20 && totalQuantity >= 0) {
      const { contract } = state
      const [totalQ, totalP] = await contract.getSnack(snackName)
      // Convert BigNumber to number
      const quantityNum = parseInt(totalQ._hex, 16)
      const ethPriceWei = await totalP.toString()
      // Convert wei to ETH using ethers.js
      const ethPrice = ethers.utils.formatEther(ethPriceWei)
      let newQuantity
      let total
      if (snackName === "chips") {
        newQuantity = totalQuantity + 1
        // setTotalQuantityChips(newQuantity)
        total = newQuantity * ethPrice
        // setTotalPriceChips(total)
        setTotalQuantity(newQuantity)
        setTotalPrice(total)
      } else if (snackName === "drinks") {
        newQuantity = totalQuantity + 1
        // setTotalQuantityDrinks(newQuantity)
        total = newQuantity * ethPrice
        // setTotalPriceDrinks(total)
        setTotalQuantity(newQuantity)
        setTotalPrice(total)
      } else if (snackName === "cookies") {
        newQuantity = totalQuantity + 1
        // setTotalQuantityCookies(newQuantity)
        total = newQuantity * ethPrice
        // setTotalPriceCookies(total)
        setTotalQuantity(newQuantity)
        setTotalPrice(total)
      }

      // setTotalQuantity(newQuantity)
      // setTotalPrice(total)
      console.log("totalQuantity", totalQuantity)
      console.log("total", total)
    }
  }

  const removeSnack = async (snackName) => {
    if (totalQuantity <= 20 && totalQuantity >= 0) {
      const { contract } = state
      const [totalQ, totalP] = await contract.getSnack(snackName)
      // Convert BigNumber to number
      const quantityNum = parseInt(totalQ._hex, 16)
      const ethPriceWei = await totalP.toString()
      // Convert wei to ETH using ethers.js
      const ethPrice = ethers.utils.formatEther(ethPriceWei)

      // setTotalQuantity((prevQuantity) => prevQuantity + 1)
      let newQuantity = totalQuantity - 1
      setTotalQuantity(newQuantity)
      let total = newQuantity * ethPrice
      setTotalPrice(total)
      console.log("totalQuantity", totalQuantity)
      console.log("total", total)
    }
  }

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
              <span className={styles.displaySpan}>Total Qty: </span>
              {totalQuantity}
            </div>
            <div className={styles.totalAmount}>
              <span className={styles.displaySpan}>Total Price: </span>
              {totalPrice} ETH
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

          {/* <div className={styles.Pay}> */}
          <button className={styles.payButton}>Pay</button>
          {/* </div> */}
        </div>
      </div>
    </>
  )
}

export default VendingMachine

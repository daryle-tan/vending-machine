import styles from "../styles/Restock.module.css"
import { useEffect, useState } from "react"

function Restock({ state }) {
  const [snackQuantities, setSnackQuantities] = useState({})

  const getSnackInfo = async (snackName) => {
    try {
      const { contract } = state
      if (contract) {
        // Check if contract exists
        const [quantity, price] = await contract.getSnack(snackName)
        // Convert BigNumber to number
        const quantityNum = parseInt(quantity._hex, 16)
        // Update the snack quantities state
        setSnackQuantities((prevQuantities) => ({
          ...prevQuantities,
          [snackName]: quantityNum,
        }))
      }
    } catch (error) {
      console.error(`Error getting ${snackName} info:`, error)
    }
  }

  useEffect(() => {
    const snackNames = ["chips", "drinks", "cookies"]
    snackNames.forEach(getSnackInfo)
  }, [state.contract])

  return (
    <>
      <div className={styles.RestockContainer}>
        <div className={styles.inventoryContainer}>
          <div className={styles.inventoryQty}>
            <span className={styles.spanInventory}>Chips: </span>
            {snackQuantities["chips"]}/20
          </div>
          <div className={styles.inventoryQty}>
            <span className={styles.spanInventory}>Drinks: </span>
            {snackQuantities["drinks"]}/20
          </div>
          <div className={styles.inventoryQty}>
            <span className={styles.spanInventory}>Cookies: </span>
            {snackQuantities["cookies"]}/20
          </div>
        </div>
        <button className={styles.restockButton}>Restock</button>
      </div>
    </>
  )
}

export default Restock

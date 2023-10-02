import styles from "../styles/Restock.module.css"
import { useEffect } from "react"
import LoadingModal from "./LoadingModal"

function Restock({
  state,
  snackQuantities,
  setSnackQuantities,
  isLoading,
  setIsLoading,
}) {
  useEffect(() => {
    const snackNames = ["chips", "drinks", "cookies"]
    snackNames.forEach(getSnackInfo)
  })

  const getSnackInfo = async (snackName) => {
    try {
      const { contract } = state
      if (contract) {
        // Check if contract exists
        const [quantity] = await contract.getSnack(snackName)
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

  const restockSnacks = async () => {
    setIsLoading(true)
    const { contract } = state
    try {
      // Manually specify the gas limit
      const gasLimit = 10000000 // Adjust this value as needed
      const tx = await contract.restock({ gasLimit })

      await tx.wait()

      // After the restocking is successful, update the snack quantities
      const snackNames = ["chips", "drinks", "cookies"]
      snackNames.forEach(getSnackInfo)

      console.log(`Snacks have been restocked!`)
    } catch (error) {
      console.error("Ran into an issue while trying to restock", error)
    }
    setIsLoading(false)
  }

  return (
    <>
      {isLoading ? (
        <LoadingModal />
      ) : (
        <div className={styles.RestockContainer}>
          <div className={styles.inventoryContainer}>
            <div className={styles.inventoryQty}>
              <span className={styles.spanInventory}>Chips: </span>
              {snackQuantities?.chips || 0}/20
            </div>
            <div className={styles.inventoryQty}>
              <span className={styles.spanInventory}>Drinks: </span>
              {snackQuantities?.drinks || 0}/20
            </div>
            <div className={styles.inventoryQty}>
              <span className={styles.spanInventory}>Cookies: </span>
              {snackQuantities?.cookies || 0}/20
            </div>
          </div>
          <button className={styles.restockButton} onClick={restockSnacks}>
            Restock
          </button>
        </div>
      )}
    </>
  )
}

export default Restock

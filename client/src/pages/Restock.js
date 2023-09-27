import styles from "../styles/Restock.module.css"

function Restock() {
  return (
    <>
      <div className={styles.RestockContainer}>
        <div className={styles.inventoryContainer}>
          <div className={styles.inventoryQty}>
            <span className={styles.spanInventory}>Chips: </span>1/20
          </div>
          <div className={styles.inventoryQty}>
            <span className={styles.spanInventory}>Drinks: </span>1/20
          </div>
          <div className={styles.inventoryQty}>
            <span className={styles.spanInventory}>Chips: </span>1/20
          </div>
        </div>
        <button className={styles.restockButton}>Restock</button>
      </div>
    </>
  )
}

export default Restock

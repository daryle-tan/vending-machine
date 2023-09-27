import styles from "../styles/Balance.module.css"

function Balance() {
  return (
    <>
      <div className={styles.BalanceContainer}>
        <header className={styles.headerBalance}>
          Vending Machine Balance:{" "}
          <span className={styles.spanBalance}>1 ETH</span>
        </header>
      </div>
    </>
  )
}

export default Balance

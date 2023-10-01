import styles from "../styles/Balance.module.css"
import { useEffect } from "react"

function Balance({ state, getBalance, balance }) {
  useEffect(() => {
    getBalance()
  }, [state])

  return (
    <>
      <div className={styles.BalanceContainer}>
        <header className={styles.headerBalance}>
          Vending Machine Balance:{" "}
          <span className={styles.spanBalance}>{balance} ETH</span>
        </header>
      </div>
    </>
  )
}

export default Balance

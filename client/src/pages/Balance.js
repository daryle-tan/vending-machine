import styles from "../styles/Balance.module.css"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

function Balance({ state }) {
  const [balance, setBalance] = useState("")
  const getBalance = async () => {
    try {
      if (state) {
        // Call the getBalance function of the VendingMachine contract
        const contractBalance = await state.contract.getBalance()
        // Format the balance value as a string
        const formattedBalance = ethers.utils.formatEther(contractBalance)
        // Update the balance state
        setBalance(formattedBalance)
        console.log("balance", balance)
      }
    } catch (error) {
      console.error("Error getting balance:", error)
    }
  }

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

import styles from "../styles/Balance.module.css"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

function Balance({ state }) {
  const [balance, setBalance] = useState("")
  const getBalance = async () => {
    try {
      const { contract } = state
      if (contract) {
        // Call the getBalance function of the VendingMachine contract
        const contractBalance = await contract.contract.getBalance()
        // Format the balance value as a string
        const formattedBalance = ethers.utils.formatEther(contractBalance)
        // Update the balance in the UI
        // const contractSpan = document.querySelector(".spanBalance")
        // contractSpan.textContent = formattedBalance
        setBalance(contractBalance)
        console.log("balance", balance)
      }
    } catch (error) {
      console.error("Error getting balance:", error)
    }
  }

  useEffect(() => {
    getBalance()
  }, [balance])

  return (
    <>
      <div className={styles.BalanceContainer}>
        <header className={styles.headerBalance}>
          Vending Machine Balance:{" "}
          <span className={styles.spanBalance}>ETH</span>
        </header>
      </div>
    </>
  )
}

export default Balance

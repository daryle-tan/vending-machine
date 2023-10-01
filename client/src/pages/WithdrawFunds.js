import styles from "../styles/WithdrawFunds.module.css"

function WithdrawFunds({ state, getBalance }) {
  const withdrawFunds = async () => {
    const { contract } = state
    try {
      const withdraw = await contract.withdraw()

      await withdraw.wait()
      console.log("Show me the money!")
    } catch (error) {
      console.error("Issue withdrawing funds", error)
    }
    getBalance()
  }
  return (
    <>
      <div className={styles.WithdrawContainer}>
        <button className={styles.withdrawButton} onClick={withdrawFunds}>
          Withdraw Funds
        </button>
      </div>
    </>
  )
}

export default WithdrawFunds

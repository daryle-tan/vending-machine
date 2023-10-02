import styles from "../styles/WithdrawFunds.module.css"
import LoadingModal from "./LoadingModal"

function WithdrawFunds({ state, getBalance, isLoading, setIsLoading }) {
  const withdrawFunds = async () => {
    setIsLoading(true)
    const { contract } = state
    try {
      const withdraw = await contract.withdraw()

      await withdraw.wait()
      console.log("Show me the money!")
    } catch (error) {
      console.error("Issue withdrawing funds", error)
    }
    getBalance()
    setIsLoading(false)
  }
  return (
    <>
      {isLoading ? (
        <LoadingModal />
      ) : (
        <button className={styles.withdrawButton} onClick={withdrawFunds}>
          Withdraw Funds
        </button>
      )}
    </>
  )
}

export default WithdrawFunds

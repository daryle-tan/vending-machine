import Head from "next/head"
import styles from "@/styles/Home.module.css"
import VendingMachine from "./VendingMachine"
import Balance from "./Balance"
import Restock from "./Restock"
import WithdrawFunds from "./WithdrawFunds"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import abi from "../contractJson/VendingMachine.json"

export default function Home() {
  const [balance, setBalance] = useState("")
  const [account, setAccount] = useState("Not Connected")
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  })

  useEffect(() => {
    const template = async () => {
      const contractAddress = "0xA99F1A7Dd3EB012D9d59Feea783096Ab53492843"
      const contractABI = abi.abi

      try {
        const { ethereum } = window
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        })

        window.ethereum.on("accountsChanged", () => {
          window.location.reload()
        })
        setAccount(account)
        const provider = new ethers.providers.Web3Provider(ethereum) //read from the Blockchain
        const signer = provider.getSigner() //write to the blockchain

        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer,
        )
        console.log(contract)
        setState({ provider, signer, contract })
      } catch (error) {
        console.log(error)
      }
    }
    template()
    console.log("state", state.contract)
  }, [])

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
        console.log("state", state)
      }
    } catch (error) {
      console.error("Error getting balance:", error)
    }
  }

  return (
    <>
      <Head>
        <title>Vending Machine</title>
        <meta name="description" content="vending machine smart contract" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <div>By Daryle Tan</div>
          <Balance state={state} getBalance={getBalance} balance={balance} />
          <ConnectButton className="connectWallet" />
        </div>

        <div className={styles.center}>
          <VendingMachine state={state} getBalance={getBalance} />
        </div>

        <div className={styles.grid}>
          <Restock state={state} />
          <WithdrawFunds state={state} />
        </div>
      </main>
    </>
  )
}

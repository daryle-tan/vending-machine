import React from "react"
import styles from "../styles/VendingMachine.module.css"
import Image from "next/image"

function VendingMachine() {
  return (
    <>
      <div className={styles.vendingContainer}>
        <div className={styles.mainVending}>
          <div className={styles.snackContainer}>
            <div className={styles.snackLabel}>A</div>
            <div className={styles.snackItem}>
              <Image
                src="/hot-cheetos.webp"
                width={100}
                height={100}
                sizes={"100vw"}
                className={styles.snackPic}
              />
            </div>
            <div className={styles.snackPrice}>0.001 ETH</div>
            <div className={styles.snackQty}>QTY: 20</div>
          </div>
          <div className={styles.snackContainer}>
            <div className={styles.snackLabel}>B</div>
            <div className={styles.snackItem}>
              <Image
                src="/coconut-water.jpeg"
                width={100}
                height={100}
                sizes={"100vw"}
                className={styles.snackPic}
              />
            </div>
            <div className={styles.snackPrice}>0.002 ETH</div>
            <div className={styles.snackQty}>QTY: 20</div>
          </div>
          <div className={styles.snackContainer}>
            <div className={styles.snackLabel}>C</div>
            <div className={styles.snackItem}>
              <Image
                src="/cookies.jpeg"
                width={100}
                height={100}
                sizes={"100vw"}
                className={styles.snackPic}
              />
            </div>
            <div className={styles.snackPrice}>0.001 ETH</div>
            <div className={styles.snackQty}>QTY: 20</div>
          </div>
        </div>
        <div className={styles.sideVending}>
          <div className={styles.displayScreen}>
            <div className={styles.totalAmount}>0.001 ETH</div>
            <div className={styles.totalQty}>1</div>
          </div>

          <div className={styles.controlQty}>
            <button className={styles.decrement}>-</button>
            <div className={styles.controlLabel}>A</div>
            <button className={styles.increment}>+</button>
            <button className={styles.decrement}>-</button>
            <div className={styles.controlLabel}>B</div>
            <button className={styles.increment}>+</button>
            <button className={styles.decrement}>-</button>
            <div className={styles.controlLabel}>C</div>
            <button className={styles.increment}>+</button>
          </div>

          <div className={styles.Pay}>
            <button className={styles.payButton}>Pay</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default VendingMachine

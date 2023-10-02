import React from "react"
import styles from "../styles/LoadingModal.module.css"

const LoadingModal = () => {
  return (
    <dialog open className={styles.loadingModal}>
      <div className={styles.spinner}></div>
      Waiting for transactions to complete...
    </dialog>
  )
}

export default LoadingModal

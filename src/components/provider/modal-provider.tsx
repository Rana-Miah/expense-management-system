'use client'
import { useState, useEffect } from "react"
import { BankAccountModal } from "../modals/bank-account-modal"
import { ShopkeeperModal, TraxNameModal } from "../modals"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <>
            <BankAccountModal />
            <TraxNameModal />
            <ShopkeeperModal/>
        </>
    )
}
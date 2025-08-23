'use client'
import { useState, useEffect } from "react"
import { BankAccountModal } from "../modals/bank-account-modal"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <>
            <BankAccountModal />
        </>
    )
}
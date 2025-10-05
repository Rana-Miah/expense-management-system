'use client'
import { useState, useEffect } from "react"
import { BankAccountModal } from "../modals/bank-account-modal"
import { ShopkeeperModal, TraxNameModal } from "../modals"
import { LoanModal } from "../modals/loan-modal"
import { FinancierModal } from "../modals/financier-modal"
import { LoanPaymentModal } from "../modals/loan-payment-modaL"
import { ItemUnitModal } from "../modals/item-unit-modal"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <>
            <LoanModal />
            <TraxNameModal />
            <ShopkeeperModal />
            <BankAccountModal />
            <FinancierModal />
            <LoanPaymentModal />
            <ItemUnitModal />
        </>
    )
}
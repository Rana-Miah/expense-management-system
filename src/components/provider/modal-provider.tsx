'use client'
import React, { useState, useEffect } from "react"
import { BankAccountModal } from "../modals/bank-account-modal"
import { ShopkeeperModal, TrxNameModal } from "../modals"
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
            <TrxNameModal />
            <ShopkeeperModal />
            <BankAccountModal />
            <FinancierModal />
            <LoanPaymentModal />
            <ItemUnitModal />
        </>
    )
}
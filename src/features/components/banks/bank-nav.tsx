import { LayoutLinkType, LayoutNav } from '@/components/layout-nav'
import { findBankById } from '@/constant/dummy-db/bank-account'
import React from 'react'

export const BankNav = async ({ params }: { params: { bankId: string } }) => {
    const { bankId } = params
    const bank = findBankById(bankId)
    const bankNav: LayoutLinkType[] = [
        {
            label: `Banks`, href: `/accounts`
        },
        {
            label: `Bank (${bank?.name})`, href: `/accounts/${bankId}`
        },
        {
            label: 'Assign Bank', href: `/accounts/${bankId}/assign-bank`
        },
        {
            label: 'Bank Transactions', href: `/accounts/${bankId}/transactions`
        },
    ]
    return (
        <LayoutNav
            links={bankNav}
        />
    )
}

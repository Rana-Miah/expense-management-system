import { LayoutLinkType, LayoutNav } from '@/components/layout-nav'
import { getBankById } from '@/services/bank/GET'
import { redirect } from 'next/navigation'
import React from 'react'

export const BankNav = async ({ params }: { params: { bankId: string } }) => {
    const { bankId } = params
    const bank =await getBankById(bankId)
    if(!bank) redirect('/')
    const bankNav: LayoutLinkType[] = [
        {
            label: `Banks`, href: `/accounts`
        },
        {
            label: `Bank (${bank.name})`, href: `/accounts/${bankId}`
        },
        {
            label: 'Assign Transaction Name', href: `/accounts/${bankId}/assign-trx-name`
        },
        {
            label: 'Bank Transactions', href: `/accounts/${bankId}/transactions`
        },
    ]

    const header = {
        title:"Bank Navigations",
        description:'Direct induvisual bank link'
    }

    return (
        <LayoutNav
            header={header}
            links={bankNav}
        />
    )
}

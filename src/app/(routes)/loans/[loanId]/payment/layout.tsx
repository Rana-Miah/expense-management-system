import { LayoutLinkType, LayoutNav } from '@/components/layout-nav'
import { dummyLoans } from '@/constant/dummy-db/loan'
import { currentUserId } from '@/lib/current-user-id'
import { getBanksByClerkUserId } from '@/services/bank'
import { getLoansByClerkUserId } from '@/services/loan'
import React, { ReactNode } from 'react'

const PaymentLayout = async ({ children }: { children: ReactNode }) => {
    const userId = await currentUserId()

    const loans = await getLoansByClerkUserId(userId, {
        where: (table, { gt }) => gt(table.due, 0),
        columns:{
            id:true,
            title:true,
            due:true
        }
    })

    const PaymentLayoutLinks: LayoutLinkType[] = loans.map(loan => ({
        href: `/loans/${loan.id}/payment`,
        label: `${loan.title}-${loan.due}`,
    }))

    const header = {
        title: 'Your all loans those remaining due',
        description: 'Loans that remaining due! direct link to payment page'
    }

    return (
        <>
            <LayoutNav
                header={header}
                links={PaymentLayoutLinks}
            />
            {children}
        </>
    )
}

export default PaymentLayout
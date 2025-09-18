import { LayoutLinkType, LayoutNav } from '@/components/layout-nav'
import { dummyLoans } from '@/constant/dummy-db/loan'
import React, { ReactNode } from 'react'

const PaymentLayout = ({ children }: { children: ReactNode }) => {


        const PaymentLayoutLinks :LayoutLinkType[]= dummyLoans.map(loan=>({
            href:`/loans/${loan.id}/payment`,
            label:loan.title,
        }))

        const header = {
            title:'Your all loans',
            description:'Loans that remaing due! direct link to payment page'
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
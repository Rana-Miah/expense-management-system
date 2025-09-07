
import { LayoutNav } from '@/components/layout-nav'
import { Banknote } from 'lucide-react'
import React from 'react'

export const LoanNav = ({ param }: { param: { loanId: string } }) => {

    console.log({ loanParam: param })
    const loanRoutes = [
        { label: 'Loans', href: '/loans', Icon: <Banknote /> },
        { label: 'Loan Payments', href: '/loans/loan-payments', },
        { label: 'Financiers', href: '/loans/financiers', Icon: <Banknote /> },
    ]

    return (
        <LayoutNav
            links={loanRoutes}
        />
    )
}

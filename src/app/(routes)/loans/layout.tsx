import { LoanNav } from '@/features/components/loan/loan-nav'
import React, { ReactNode } from 'react'

const LoanLayout = async ({ children, params }: { children: ReactNode, params: Promise<{ loanId: string }> }) => {
    const param = await params
    return (
        <div>
            <LoanNav param={param} />
            {children}
        </div>
    )
}

export default LoanLayout
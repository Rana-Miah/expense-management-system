import { MobileNavbar } from '@/components/navbar'
import { BankNav } from '@/features/components/banks/bank-nav'
import React, { ReactNode } from 'react'

const BankLayout = async ({ children, params }: { children: ReactNode, params: Promise<{ bankId: string }> }) => {
    const param = await params
    return (
        <>
            <BankNav params={param} />
            {
                children
            }
        </>
    )
}

export default BankLayout
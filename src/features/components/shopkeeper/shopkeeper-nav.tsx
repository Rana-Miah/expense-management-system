
import { LayoutNav } from '@/components/layout-nav'
import { Banknote } from 'lucide-react'
import React from 'react'

export const ShopkeeperLink = () => {


    const loanRoutes = [
        { label: 'Shopkeepers', href: '/shopkeepers', Icon: <Banknote /> },
        { label: 'Payments', href: '/shopkeepers/payments', },
        { label: 'Purchases', href: '/shopkeepers/purchases', Icon: <Banknote /> },
    ]

    const header = {
        title: "Shopkeeper Navigations",
        description: 'Direct links to navigate'
    }
    return (
        <LayoutNav
            header={header}
            links={loanRoutes}
        />
    )
}

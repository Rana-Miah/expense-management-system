import { LayoutNav } from "@/components/layout-nav";
import { Edit, HandCoins, Info, ShoppingBag } from "lucide-react";
import { ReactNode } from "react";

const ShopkeeperDetailsLayoutPage = async ({ children, params }: { children: ReactNode; params: Promise<{ shopkeeperId: string }> }) => {
    const param = await params

    return (
        <>
            <LayoutNav
                links={[
                    {
                        href: `/shopkeepers/${param.shopkeeperId}/edit`,
                        label: 'Edit',
                        Icon: <Edit />
                    },
                    {
                        href: `/shopkeepers/${param.shopkeeperId}`,
                        label: 'Details',
                        Icon: <Info />
                    },
                    {
                        href: `/shopkeepers/${param.shopkeeperId}/payment`,
                        label: 'Payment',
                        Icon: <HandCoins />
                    },
                    {
                        href: `/shopkeepers/${param.shopkeeperId}/purchase-item`,
                        label: 'Purchase',
                        Icon: <ShoppingBag />
                    },
                ]}
            />
            {children}
        </>
    )
}

export default ShopkeeperDetailsLayoutPage
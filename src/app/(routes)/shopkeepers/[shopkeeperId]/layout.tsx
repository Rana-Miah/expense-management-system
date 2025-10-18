import { LayoutNav } from "@/components/layout-nav";
import { db } from "@/drizzle/db";
import { currentUserId } from "@/lib/current-user-id";
import { Edit, HandCoins, Info, ShoppingBag } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const ShopkeeperDetailsLayoutPage = async ({ children, params }: { children: ReactNode; params: Promise<{ shopkeeperId: string }> }) => {
    const userId = await currentUserId()
    const param = await params
    const currentShopkeeper = await db.query.shopkeeperTable.findFirst({
        where: (table, { and, eq }) => (
            and(
                eq(table.clerkUserId, userId),
                eq(table.id, param.shopkeeperId)
            )
        )
    })

    if (!currentShopkeeper) redirect('/shopkeepers')

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
                        Icon: <HandCoins />,
                        visible: currentShopkeeper.totalDue > 0
                    },
                    {
                        href: `/shopkeepers/${param.shopkeeperId}/purchase-item`,
                        label: 'Purchase',
                        Icon: <ShoppingBag />,
                        visible: !currentShopkeeper.isBlock || !currentShopkeeper.isDeleted
                    },
                ]}
            />
            {children}
        </>
    )
}

export default ShopkeeperDetailsLayoutPage
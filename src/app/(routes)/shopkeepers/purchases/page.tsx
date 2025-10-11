import { db } from "@/drizzle/db"
import { ShopkeeperPaymentsTable } from "@/features/components/shopkeeper/payments/table"
import { ShopkeeperPurchasesTable } from "@/features/components/shopkeeper/purchases"
import { currentUserId } from "@/lib/current-user-id"

const ShopkeeperPurchasesPage = async () => {
    const userId = await currentUserId()
    const purchases = await db.query.shopkeeperPaymentTable.findMany({
        where: (table, { eq }) => (eq(table.clerkUserId, userId)),
        with:{
            shopkeeper:{
                columns:{
                    id:true,
                    name:true,
                }
            },
            sourceBank:{
                columns:{
                    id:true,
                    name:true,
                }
            }
        },
        columns:{
            sourceBankId:false,
            shopkeeperId:false
        }
    })
    return (
        <ShopkeeperPurchasesTable/>
    )
}

export default ShopkeeperPurchasesPage
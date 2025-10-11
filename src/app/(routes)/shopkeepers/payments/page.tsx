import { db } from "@/drizzle/db"
import { ShopkeeperPaymentsTable } from "@/features/components/shopkeeper/payments/table"
import { currentUserId } from "@/lib/current-user-id"

const ShopkeeperPaymentsPage = async () => {
    const userId = await currentUserId()
    const payments = await db.query.shopkeeperPaymentTable.findMany({
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
        <ShopkeeperPaymentsTable
            payments={payments}
        />
    )
}

export default ShopkeeperPaymentsPage
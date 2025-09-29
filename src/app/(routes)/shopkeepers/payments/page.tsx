import { db } from "@/drizzle/db"
import { ShopkeeperPaymentsTable } from "@/features/components/shopkeeper/payments/table"
import { currentUserId } from "@/lib/current-user-id"

const ShopkeeperPaymentsPage = async () => {
    const userId = await currentUserId()
    const payments = await db.query.shopkeeperPaymentTable.findMany({
        where: (table, { eq }) => (eq(table.clerkUserId, userId)),
    })
    return (
        <ShopkeeperPaymentsTable
            payments={payments}
        />
    )
}

export default ShopkeeperPaymentsPage
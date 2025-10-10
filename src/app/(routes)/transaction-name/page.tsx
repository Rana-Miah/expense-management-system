import { db } from '@/drizzle/db'
import { TrxNameTable } from '@/features/components/transaction-name/table'
import { currentUserId } from '@/lib/current-user-id'

const TrxName = async () => {
    const userId = await currentUserId()
    const trxNames = await db.query.trxNameTable.findMany({
        where: (trxName, { and, eq }) => and(
            eq(trxName.clerkUserId, userId),
            eq(trxName.isDeleted, false)
        )
    })

    return (
        <TrxNameTable
            trxName={trxNames}
        />
    )
}

export default TrxName


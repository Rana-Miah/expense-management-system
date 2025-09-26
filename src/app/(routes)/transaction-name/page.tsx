import { db } from '@/drizzle/db'
import { TraxNameTable } from '@/features/components/transaction-name/table'
import { currentUserId } from '@/lib/current-user-id'

const TraxName = async () => {
    const userId = await currentUserId()
    const trxNames = await db.query.trxNameTable.findMany({
        where: (trxName, { eq }) => eq(trxName.clerkUserId, userId)
    })

    return (
        <TraxNameTable
            traxName={trxNames}
        />
    )
}

export default TraxName


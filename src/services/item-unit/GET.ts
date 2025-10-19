import { db } from "@/drizzle/db"

export const getItemUnitByIdAndClerkUserId = async (itemUnitId: string, clerkUserId: string) => {
    const existItemUnit = await db.query.itemUnitTable.findFirst({
        where: (table, { and, eq }) => (and(
            eq(table.id, itemUnitId),
            eq(table.clerkUserId, clerkUserId)
        ))
    })

    return existItemUnit
}
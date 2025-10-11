import { LayoutLinkType, LayoutNav } from "@/components/layout-nav"
import { db } from "@/drizzle/db"
import { bankAccountTable, itemUnitTable, loanFinancierTable, monthlyBudgetTable, shopkeeperTable, trxNameTable } from "@/drizzle/schema"
import { WithChildren } from "@/interface/components-common-props"
import { currentUserId } from "@/lib/current-user-id"
import { and, eq, sql } from "drizzle-orm"

type RestoreDeletedRowLayoutProps = WithChildren
const RestoreDeletedRowLayout = async ({ children }: RestoreDeletedRowLayoutProps) => {
    const userId = await currentUserId()

    const [bankCount] = await db.select({ count: sql<number>`count(*)` })
        .from(bankAccountTable)
        .where(and(
            eq(bankAccountTable.clerkUserId, userId),
            eq(bankAccountTable.isDeleted, true),
        ))

    const [budgetCount] = await db.select({ count: sql<number>`count(*)` })
        .from(monthlyBudgetTable)
        .where(and(
            eq(monthlyBudgetTable.clerkUserId, userId),
            eq(monthlyBudgetTable.isDeleted, true),
        ))

    const [trxNameCount] = await db.select({ count: sql<number>`count(*)` })
        .from(trxNameTable)
        .where(and(
            eq(trxNameTable.clerkUserId, userId),
            eq(trxNameTable.isDeleted, true),
        ))

    const [loanFinancierCount] = await db.select({ count: sql<number>`count(*)` })
        .from(loanFinancierTable)
        .where(and(
            eq(loanFinancierTable.clerkUserId, userId),
            eq(loanFinancierTable.isDeleted, true),
        ))

    const [shopkeeperCount] = await db.select({ count: sql<number>`count(*)` })
        .from(shopkeeperTable)
        .where(and(
            eq(shopkeeperTable.clerkUserId, userId),
            eq(shopkeeperTable.isDeleted, true),
        ))

    const [itemUnitCount] = await db.select({ count: sql<number>`count(*)` })
        .from(itemUnitTable)
        .where(and(
            eq(itemUnitTable.clerkUserId, userId),
            eq(itemUnitTable.isDeleted, true),
        ))

    const links: LayoutLinkType[] = [
        {
            href: '/restore',
            label: 'All Deleted',
        },
        {
            href: '/restore/deleted-banks',
            label: 'Deleted Banks',
            visible: bankCount.count > 0
        },
        {
            href: '/restore/deleted-trx-names',
            label: 'Deleted Transaction Names',
            visible: trxNameCount.count > 0
        },
        {
            href: '/restore/deleted-shopkeepers',
            label: 'Deleted Shopkeepers',
            visible: shopkeeperCount.count > 0
        },
        {
            href: '/restore/deleted-loan-financiers',
            label: 'Deleted Financiers',
            visible: loanFinancierCount.count > 0
        },
        {
            href: '/restore/deleted-item-units',
            label: 'Deleted Units',
            visible: itemUnitCount.count > 0
        },
        {
            href: '/restore/deleted-budgets',
            label: 'Deleted Budgets',
            visible: budgetCount.count > 0
        },
    ]
    return (
        <>
            <LayoutNav
                links={links}
                header={{
                    title: 'Restore deleted row navigation',
                    description: 'Direct link to specific data.'
                }}
            />
            <section>
                {
                    children
                }
            </section>
        </>
    )
}

export default RestoreDeletedRowLayout
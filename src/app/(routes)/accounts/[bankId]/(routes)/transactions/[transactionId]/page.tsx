import { CardWrapper } from "@/components"
import { findBankById } from "@/constant/dummy-db/bank-account"
import { findTrxNamesByClerkUserId } from "@/constant/dummy-db/trx-name"
import { TransactionForm } from "@/features/components/transaction/form"
import { redirect } from "next/navigation"

const TransactionPage = async ({ params }: { params: Promise<{ bankId: string; transactionId: string }> }) => {
    const param = await params
    const bank = {}//findBankById(param.bankId)
    // if (!bank) redirect('/')


    const trxNames = []//findTrxNamesByClerkUserId(bank.clerkUserId)
    return (
        <div className="flex items-center pt-4">
            <CardWrapper
                title="Transaction Form"
                description="Create your Transaction"
            >
                <TransactionForm bank={bank} trxNames={trxNames} />
            </CardWrapper>
        </div>
    )
}

export default TransactionPage
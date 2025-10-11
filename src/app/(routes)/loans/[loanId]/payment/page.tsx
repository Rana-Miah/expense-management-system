import { CardWrapper } from "@/components"
import { LoanPaymentForm } from "@/features/components/loan/form"
import { currentUserId } from "@/lib/current-user-id"
import { getBankByClerkUserId, getBanksByClerkUserId } from "@/services/bank"
import { getLoanByIdAndClerkUserId, getLoansByClerkUserId } from "@/services/loan"
import { redirect } from "next/navigation"

const LoanPaymentPage = async ({ params }: { params: Promise<{ loanId: string }> }) => {
    const userId = await currentUserId()
    const param = await params
    const currentLoan = await getLoanByIdAndClerkUserId(param.loanId, userId, {
        with: {
            financier: {
                columns: {
                    id: true,
                    isDeleted: true,
                    name: true,
                    financierType:true
                }
            }
        }
    })

    const banks = await getBanksByClerkUserId(userId, {
        where(fields, operators) {
            return operators.eq(fields.isDeleted,false)
        },
        columns:{
            id:true,
            name:true,
            isActive:true,
            balance:true
        }       
    })

    if (!currentLoan) redirect('/loans')


    console.dir({ currentLoan }, { depth: null })

    const { loanType } = currentLoan
    const isDebit = loanType === 'Debit'
    const cardTitle = isDebit ? 'Pay your previous loan bill' : 'Receive your previous loan bill'

    return (
        <div className="h-screen">
            <CardWrapper
                title={cardTitle}
                description="Happy to see you here!"
            >
                <LoanPaymentForm
                    loan={currentLoan}
                    banks={banks}
                />
            </CardWrapper>
        </div>
    )
}

export default LoanPaymentPage
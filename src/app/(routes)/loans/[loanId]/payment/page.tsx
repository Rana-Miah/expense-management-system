import { CardWrapper } from "@/components"
import { getLoanById } from "@/constant/dummy-db/loan"
import { LoanPaymentForm } from "@/features/components/loan/form"
import { redirect } from "next/navigation"

const LoanPaymentPage = async ({ params }: { params: Promise<{ loanId: string }> }) => {
    const param = await params
    const currentLoan = getLoanById(param.loanId)

    if (!currentLoan) redirect('/loans')

    const { loanType } = currentLoan
    const isDebit = loanType === 'Debit'
    const cardTitle = isDebit ? 'Pay your previous loan bill' : 'Receive your previous loan bill'

    return (
        <CardWrapper
            title={cardTitle}
            description="Happy to see you here!"
        >
            <LoanPaymentForm
                loan={currentLoan}
            />
        </CardWrapper>
    )
}

export default LoanPaymentPage
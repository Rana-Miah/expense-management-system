import { dummyLoanPayment } from "@/constant/dummy-db/loan-payment"
import { LoanPaymentsTable } from "@/features/components/loan/table"

const LoanPaymentsPage = () => {

    return (
       <LoanPaymentsTable
        loanPayments={dummyLoanPayment}
       />
    )
}

export default LoanPaymentsPage
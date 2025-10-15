import { CardWrapper, DataTable } from '@/components'
import { pluralize } from '@/lib/helpers'
import { LoanPayment, loanPaymentsColumns } from './columns'

export const LoanPaymentsTable = ({ loanPayments }: { loanPayments: LoanPayment[]}) => {
    const length = loanPayments.length

    return (
        <CardWrapper
            title={`${pluralize(length, 'Loan Payment')}`}
            description='Monitor your all loans payments'
        >
            <DataTable data={loanPayments} columns={loanPaymentsColumns} />
        </CardWrapper>
    )
}

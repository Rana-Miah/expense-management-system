import { CardWrapper, DataTable } from '@/components'
import { LoanPayment } from '@/constant/dummy-db/loan-payment'
import { pluralize } from '@/lib/helpers'
import { loanPaymentsColumns } from './columns'
import { ModalTriggerButton } from '@/components/modal-trigger-button'
import { MODAL_TYPE } from '@/constant'

export const LoanPaymentsTable = ({ loanPayments }: { loanPayments: LoanPayment[] }) => {
    const length = loanPayments.length

    return (
        <CardWrapper
            title={`${pluralize(length, 'Loan Payment')}`}
            description='Monitor your all loans payments'
            headerElement={
                <ModalTriggerButton
                    label='Payment'
                    modalType={MODAL_TYPE.LOAN_PAYMENT}
                />}
        >
            <DataTable data={loanPayments} columns={loanPaymentsColumns} />
        </CardWrapper>
    )
}

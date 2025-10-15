import { CardWrapper, DataTable } from '@/components'
import { LoanPayment } from '@/constant/dummy-db/loan-payment'
import { pluralize } from '@/lib/helpers'
import { loanPaymentsColumns } from './columns'
import { ModalTriggerButton } from '@/components/modal-trigger-button'
import { MODAL_TYPE } from '@/constant'

export const LoanPaymentsTable = ({ loanPayments }: { loanPayments: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    loanType: "Debit" | "Credit" | "Both";
    title: string;
    loanDate: Date;
    due: number;
    detailsOfLoan: string;
    loanStatus: "Repaid" | "Settled" | "Closed";
    financier: {
        id: string;
        name: string;
    };
    receiveBank: {
        id: string;
        name: string;
    } | null;
    sourceBank: {
        id: string;
        name: string;
    } | null;
}[] }) => {
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

import { LoanPayment } from "@/constant/dummy-db/loan-payment";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { LoanTitleWithFinancierName } from "./loan-title-with-financier-name-column-cell";
import { LoanAmountCell } from "./loan-amount-column-cell";
import { LoanPaymentAmount } from "./loan-payment-amount-column-cell";
import { PaymentDateColumnCell } from "./payment-date-column-cell";
import { LoanPaymentsReceiveBankColumnCell, LoanPaymentsSourceBankColumnCell } from "./loan-payment-bank-column-cell";
import { LoanPaymentActionsColumnCell } from "./actions-column-cell";
import { LoanPaymentType } from "./loan-payment-type-column-cell";

type LoanPaymentsColumn = ColumnDef<LoanPayment>
export type LoanPaymentsTableCellContext = CellContext<LoanPayment, unknown>

const loanTitleWithFinancierName: LoanPaymentsColumn = {
    accessorKey: 'loanId',
    header: 'Loan/Financier',
    cell: LoanTitleWithFinancierName
}


const loanAmount: LoanPaymentsColumn = {
    accessorKey: 'loanId-amount',
    header: 'Loan Amount',
    cell: LoanAmountCell
}


const paymentAmount: LoanPaymentsColumn = {
    accessorKey: 'amount',
    header: 'Payment Amount',
    cell: LoanPaymentAmount
}


const paymentType: LoanPaymentsColumn = {
    accessorKey: 'paymentType',
    header: 'Payment Type',
    cell: LoanPaymentType
}


const paymentDate: LoanPaymentsColumn = {
    accessorKey: 'paymentDate',
    header: 'Payment Date',
    cell: PaymentDateColumnCell
}

const sourceBank: LoanPaymentsColumn = {
    accessorKey: 'sourceBankId',
    header: 'Source Bank',
    cell: LoanPaymentsSourceBankColumnCell
}

const receiveBank: LoanPaymentsColumn = {
    accessorKey: 'receiveBankId',
    header: 'Receive Bank',
    cell: LoanPaymentsReceiveBankColumnCell
}

const action: LoanPaymentsColumn = {
    id: 'Actions',
    cell: LoanPaymentActionsColumnCell
}


export const loanPaymentsColumns: LoanPaymentsColumn[] = [
    loanTitleWithFinancierName,
    loanAmount,
    paymentAmount,
    paymentType,
    sourceBank,
    receiveBank,
    paymentDate,
    action
]
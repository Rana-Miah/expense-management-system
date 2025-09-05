import { Loan } from "@/constant/dummy-db/loan";
import { ColumnDef } from "@tanstack/react-table";

const financierId: ColumnDef<Loan> = {
    accessorKey: "financierId",
    header: "Financier",
    // cell: Cell
}
const receiveBankId: ColumnDef<Loan> = {
    accessorKey: "receiveBankId",
    header: "Receive Bank",
    // cell: Cell
}
const sourceBankId: ColumnDef<Loan> = {
    accessorKey: "sourcebankId",
    header: "Source Bank",
    // cell: Cell
}
const loanType: ColumnDef<Loan> = {
    accessorKey: "loanType",
    header: "Loan Type",
    // cell: Cell
}
const title: ColumnDef<Loan> = {
    accessorKey: "title",
    header: "Title",
    // cell: Cell
}
const amount: ColumnDef<Loan> = {
    accessorKey: "amount",
    header: "Amount",
    // cell: Cell
}
const due: ColumnDef<Loan> = {
    accessorKey: "due",
    header: "Due",
    // cell: Cell
}
const detailsOfLoan: ColumnDef<Loan> = {
    accessorKey: "detailsOfLoan",
    header: "Loan Details",
    // cell: Cell
}
const loanStatus: ColumnDef<Loan> = {
    accessorKey: "loanStatus",
    header: "Status",
    // cell: Cell
}
const createdAt: ColumnDef<Loan> = {
    accessorKey: "createdAt",
    header: "Create",
    // cell: Cell
}
const updatedAt: ColumnDef<Loan> = {
    accessorKey: "updatedAt",
    header: "Last Update",
    // cell: Cell
}

export const loanColumns: ColumnDef<Loan>[] = [
    title,
    amount,
    due,
    loanType,
    loanStatus,
    financierId,
    receiveBankId,
    sourceBankId,
    detailsOfLoan,
    createdAt,
    updatedAt,
]
'use client'

import { ColumnDef, flexRender, getCoreRowModel, ColumnFiltersState, getFilteredRowModel, useReactTable, VisibilityState } from "@tanstack/react-table"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { DataTablePagination } from "./data-table-pagination"
import { useState } from "react"
import { Button } from "./ui/button"
import { ChevronDown, X } from "lucide-react"
import { Input } from "./ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Pagination } from "@/interface"
import { Badge } from "./ui/badge"


type BaseDataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}


type WithPagination<TData, TValue> = BaseDataTableProps<TData, TValue> & {
    pagination?: Pagination

}

type DataTableProps<TData, TValue> = WithPagination<TData, TValue>


export const DataTable = <TData, TValue>({ columns, data, pagination, }: DataTableProps<TData, TValue>) => {

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnVisibility,
            columnFilters,
        }
    })
    const [selectFilterByColumnName, setSelectFilterByColumnName] = useState<string>(table.getAllColumns()[0].id)



    return (
        <>
            {/* Pagination */}
            {
                pagination && (
                    <DataTablePagination pagination={pagination} />
                )
            }

            <div className="flex flex-col">
                <Input
                    placeholder={`Filter ${selectFilterByColumnName}`}
                    value={(table.getColumn(selectFilterByColumnName)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(selectFilterByColumnName)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex items-center gap-1.5 py-3">
                    <Select onValueChange={(value) => setSelectFilterByColumnName(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={`Filter by ${selectFilterByColumnName}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {table
                                .getAllColumns()
                                .map((column) => {
                                    return (
                                        <SelectItem value={column.id} key={column.id}>{column.id}</SelectItem>
                                    )
                                })}
                        </SelectContent>
                    </Select>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-1.5">
                                <span className="flex items-center gap-1.5">
                                    Columns
                                </span>
                                <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) => column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination */}
            {
                pagination && (
                    <DataTablePagination pagination={pagination} />
                )
            }
        </>
    )
}
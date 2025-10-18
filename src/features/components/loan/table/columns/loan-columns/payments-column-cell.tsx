'use client'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'


import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { amountFormatter, } from '@/lib/helpers'
import { LoanPaymentColumn, LoanTableCellContext } from '.'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { TableDateCellWithWeekName } from '@/components/table-date-cell'

type PaymentCardProps = {
    data: LoanPaymentColumn;
    index: number
};

export const PurchaseItemsColumnCell = ({ row: { original: { loanPayments, loanStatus, financier, title, loanType } } }: LoanTableCellContext) => {
    const itemsLength = loanPayments.length

    return (
        <>
            {
                (itemsLength > 0 || loanStatus === 'Repaid') ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className='w-full'>
                                Payments ({itemsLength})<sup>+</sup>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>

                            <div className="space-y-2 pb-3">
                                <h4 className="leading-none font-medium">Total Number of Payments ({itemsLength})</h4>
                                <CardTitle className="flex items-center gap-2">
                                    <span>
                                        {title}
                                    </span>
                                    <Badge
                                        className='rounded-full'
                                    >
                                        {loanType}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Loan Payments to <span className="font-semibold">{financier.name}</span>
                                </CardDescription>
                            </div>
                            <div className="w-full max-w-80 max-h-[300px] overflow-y-auto space-y-2 py-2 pr-3">
                                {
                                    loanPayments.map((item, index) => (
                                        <PaymentCard
                                            index={index}
                                            key={item.id}
                                            data={item}
                                        />
                                    ))
                                }
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : "No Item Purchased"
            }
        </>
    )
}



export function PaymentCard({ data, index }: PaymentCardProps) {
    const { amount, paymentDate, paymentType, paymentNote, receiveBank, sourceBank } = data

    return (
        <Card className="w-full max-w-md shadow-sm hover:shadow-md transition-shadow rounded-2xl border border-muted">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Payment #{data.id}</CardTitle>
                <Badge
                    variant="secondary"
                    className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        paymentType === 'Receipt'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                    )}
                >
                    {paymentType}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment</span>
                    <CardTitle className="font-medium text-primary">
                        #{index++}
                    </CardTitle>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <CardTitle className="font-medium text-primary">
                        {amountFormatter(amount)}
                    </CardTitle>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <div>
                        <TableDateCellWithWeekName
                            date={paymentDate}
                            includeWeekName
                        />
                    </div>
                </div>

                <Separator />

                <div className="space-y-1">
                    {receiveBank && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Receive Bank</span>
                            <span className="font-medium">{receiveBank.name}</span>
                        </div>
                    )}

                    {sourceBank && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Source Bank</span>
                            <span className="font-medium">{sourceBank.name}</span>
                        </div>
                    )}
                </div>

                {paymentNote && (
                    <>
                        <Separator />
                        <div>
                            <span className="text-muted-foreground block mb-1">Note</span>
                            <p className="text-sm text-foreground">{paymentNote}</p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
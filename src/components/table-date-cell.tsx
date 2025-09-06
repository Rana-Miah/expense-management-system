'use client'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { dateFormatter } from '@/lib/helpers'

export const TableDateCellWithWeekName = ({ date, includeWeekName }: { date: Date | string | number, includeWeekName?: boolean }) => {
    return (
        <>
            {
                includeWeekName ? (
                    <>
                        <CardTitle>{
                            dateFormatter(new Date(date), 'dd MMMM, yyyy')
                        }</CardTitle>
                        <CardDescription>{
                            dateFormatter(new Date(date), 'EEEE')
                        }</CardDescription>
                    </>
                ) : (
                    <CardDescription>{
                        dateFormatter(new Date(date), 'dd MMMM, yyyy')
                    }</CardDescription>
                )
            }
        </>
    )
}
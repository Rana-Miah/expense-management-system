'use client'
import { CardWrapper, DataTable } from "@/components"
import z from "zod"

import { amountFormatter, dateFormatter } from '@/lib/helpers'
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { DateTimePicker } from "@/components/ui/extension/date-picker"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { DummyOvertime, dummyOvertimeSeed } from "@/constant/dummy-db/overtime-salary"
import { months } from "@/constant/month"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { expectedSalaryCalculate } from "@/constant/dummy-db/expected-salary"
import { v4 as uuid_v4 } from 'uuid'
import { CardDescription, CardTitle } from "@/components/ui/card"

const salaryCalculationForm = z.object({
    currentDate: z.date(),
    targetDate: z.date(),
    vacationSalary: z.coerce.number<number>(),
    brokenMonthSalary: z.coerce.number<number>(),
    iqamaRenewValidMonth: z.coerce.number<number>(),
    deductedSalarySaving: z.coerce.number<number>(),
    fullSalarySaving: z.coerce.number<number>(),
})


export const SalaryCalculation = () => {

    const [date, setDate] = useState<{ targetDate: Date, currentDate: Date; }>({
        currentDate: new Date(),
        targetDate: new Date()
    })

    const form = useForm({
        resolver: zodResolver(salaryCalculationForm),
        defaultValues: {
            currentDate: new Date(),
            targetDate: new Date(),
            iqamaRenewValidMonth: 0,
            brokenMonthSalary: 0,
            vacationSalary: 0,
            deductedSalarySaving: 0,
            fullSalarySaving: 0
        }
    })

    const { control, handleSubmit } = form

    function getRemainingMonths(targetDate: Date): number {
        const now = new Date();

        const yearsDiff = targetDate.getFullYear() - now.getFullYear();
        const monthsDiff = targetDate.getMonth() - now.getMonth();

        // total months difference
        let totalMonths = yearsDiff * 12 + monthsDiff;

        return totalMonths < 0 ? 0 : totalMonths;
    }

    const submit = handleSubmit((value) => {
        // setDate(value)
        const remainingMonth = getRemainingMonths(value.targetDate)

        const numberOfDeductedSalary = Math.round(remainingMonth / value.iqamaRenewValidMonth)

        const numberOfFullSalary = Math.round(remainingMonth - numberOfDeductedSalary)

        const arr = Array.from({ length: remainingMonth }, _ => {
            return {
                dudectedSalary: numberOfDeductedSalary * Math.abs(value.deductedSalarySaving),
                fullSalary: numberOfFullSalary * Math.abs(value.deductedSalarySaving),
            }
        })

        console.log(
            {
                ...value,
                remainingMonth,
                numberOfDeductedSalary,
                numberOfFullSalary,
                dudectedSalary: numberOfDeductedSalary * Math.abs(value.deductedSalarySaving),
                fullSalary: numberOfFullSalary * Math.abs(value.deductedSalarySaving),
            }
        )



    })


    const remainingMonth = getRemainingMonths(date.targetDate)
    const overtimeSalaries = dummyOvertimeSeed.filter(ot => new Date(ot.createdAt).getTime() < new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime())
    // const arr = Array.from({ length: remainingMonth }) || []
    // const formattedArr = arr.map((_, i) => {
    //     const nows = new Date()
    //     const currentMont = nows.getMonth() + i
    //     const newDate = new Date(new Date().setMonth(currentMont))

    //     return {
    //         id: "string",
    //         clerkUserId: "string",
    //         month: format(newDate, 'MMMM'),
    //         year: newDate.getFullYear().toString(),
    //         overtimeHour: 82,
    //         expectedOvertimeRate: 4.35,
    //         isCollected: false,
    //         collectedDate: null,
    //         collectedMoney: null,
    //         overtimeRate: null,
    //         createdAt: null,
    //         updatedAt: null,
    //     }
    // })
    // console.log({ ...date, remainingMonth, overtimeSalaries, formattedArr, combined: [...overtimeSalaries, ...formattedArr] })


    const hasUserCalculationData = !!expectedSalaryCalculate

    const expectedSalaryCalculation = (remainingMonth: number) => {

        const numberOfDeductedSalary = Math.round(remainingMonth / expectedSalaryCalculate.renewedIqamaDuration)
        const numberOfFullSalary = Math.round(remainingMonth - numberOfDeductedSalary)

        return {
            numberOfDeductedSalary,
            numberOfFullSalary,
            totalSavingsAfterDeductedSalary: numberOfDeductedSalary * expectedSalaryCalculate.savingsAfterDeductedSalary,
            totalSavingsAfterFullSalary: numberOfFullSalary * expectedSalaryCalculate.savingsAfterFullSalary
        }
    }

    const calculateOvertimeSalary = (targetDate?: Date) => {
        //until previous month
        const pendingOvertimeSalary = dummyOvertimeSeed.filter(ot => (
            new Date(ot.createdAt).getTime() < new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime()
        ))

        const expectedSalaryArr = targetDate ? Array.from({ length: getRemainingMonths(targetDate) }) : []
        const expectedSalary = targetDate ? expectedSalaryArr.map((_, i) => {
            const now = new Date()
            const baseDate = new Date(now.getFullYear(), now.getMonth(), 1)
            baseDate.setMonth(baseDate.getMonth() + i)

            const buildArr: DummyOvertime = {
                id: uuid_v4(),
                clerkUserId: "user_001",
                month: format(baseDate, 'MMMM'),
                year: baseDate.getFullYear().toString(),
                overtimeHour: expectedSalaryCalculate.minMonthlyOverTimeHour,
                expectedOvertimeRate: expectedSalaryCalculate.expectedOvertimeRatePerHour,
                isCollected: false,
                collectedDate: null,
                collectedMoney: null,
                overtimeRate: null,
                createdAt: targetDate.toISOString(),
                updatedAt: targetDate.toISOString(),
            }


            return buildArr
        }) : []

        console.log({ expectedSalary, remaining: getRemainingMonths(targetDate || new Date()), expectedSalaryArr })

        const expectedOvertimeSalary = targetDate ? [...pendingOvertimeSalary, ...expectedSalary] : pendingOvertimeSalary

        const collectedSalary = expectedOvertimeSalary
            .filter(ot => ot.isCollected)
            .reduce((acc, { collectedMoney }) => {
                if (!collectedMoney) return acc + 0
                return acc + collectedMoney
            }, 0)

        const pendingSalary = expectedOvertimeSalary
            .filter(ot => !ot.isCollected)
            .reduce((acc, { overtimeHour, expectedOvertimeRate }) => {
                if (!overtimeHour) return acc + expectedOvertimeRate * 0
                return acc + (overtimeHour * expectedOvertimeRate)
            }, 0)

        console.log({ expectedOvertimeSalary })

        return {
            collectedSalary,
            pendingSalary,
            totalSalary: collectedSalary + pendingSalary,
            expectedOvertimeSalary
        }
    }

    // calculateOvertimeSalary()
    console.log({
        targetDate: expectedSalaryCalculate.targetDate
    })
    return (
        <CardWrapper
            title="Expected Salary Calculation"
            description="Calculation your expected salary for future"

        >
            <Separator className="my-4" />
            {
                hasUserCalculationData ? (
                    <div>
                        <div className="flex items-center gap-2">
                            <span>Current Date : </span>
                            <span>{dateFormatter(new Date(), 'dd MMMM, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Target Date : </span>
                            <span>{dateFormatter(expectedSalaryCalculate.targetDate, 'dd MMMM, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Remaining Month : </span>
                            <span>{getRemainingMonths(expectedSalaryCalculate.targetDate)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Number Of Full Salary : </span>
                            <span>{expectedSalaryCalculation(getRemainingMonths(expectedSalaryCalculate.targetDate)).numberOfFullSalary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Number Of Deducted Salary : </span>
                            <span>{expectedSalaryCalculation(getRemainingMonths(expectedSalaryCalculate.targetDate)).numberOfDeductedSalary}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Full Salary : </span>
                            <span>{expectedSalaryCalculation(getRemainingMonths(expectedSalaryCalculate.targetDate)).totalSavingsAfterFullSalary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Deducted Salary : </span>
                            <span>{expectedSalaryCalculation(getRemainingMonths(expectedSalaryCalculate.targetDate)).totalSavingsAfterDeductedSalary}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Expected Total Salary : </span>
                            <span>{
                                expectedSalaryCalculation(getRemainingMonths(expectedSalaryCalculate.targetDate)).totalSavingsAfterDeductedSalary +
                                expectedSalaryCalculation(getRemainingMonths(expectedSalaryCalculate.targetDate)).totalSavingsAfterFullSalary
                            }</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Expected Total Collected Overtime Salary : </span>
                            <span>{
                                calculateOvertimeSalary(expectedSalaryCalculate.targetDate).collectedSalary
                            }</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Expected Total Pending Overtime Salary : </span>
                            <span>{
                                calculateOvertimeSalary(expectedSalaryCalculate.targetDate).pendingSalary
                            }</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Expected Total Overtime Salary : </span>
                            <span>{
                                calculateOvertimeSalary(expectedSalaryCalculate.targetDate).totalSalary
                            }</span>
                        </div>
                    </div>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={submit}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-4">
                                <FormField
                                    control={control}
                                    name="currentDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Current Date</Label>
                                            <FormControl>
                                                <DateTimePicker
                                                    {...field}
                                                    value={new Date(field.value)}
                                                    disabled={true}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="targetDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Target Date</Label>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date() || date < new Date("1900-01-01")
                                                            }
                                                            captionLayout="label"
                                                            className="w-full"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={control}
                                name="vacationSalary"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Vacation Salary</Label>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="e.g. 1500"
                                                {...field}
                                                value={field.value}

                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="brokenMonthSalary"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Broken Month Salary</Label>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="e.g. 1500"
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="iqamaRenewValidMonth"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Renew Iqama Period</Label>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="e.g. 3"
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="deductedSalarySaving"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Saving after deducted salary</Label>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="e.g. 3"
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="fullSalarySaving"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Saving after full salary</Label>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="e.g. 3"
                                                {...field}
                                                value={field.value}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                            >
                                Calculate
                            </Button>
                        </form>
                    </Form>
                )
            }
            <Separator className="my-4" />
            <DataTable
                data={calculateOvertimeSalary(expectedSalaryCalculate.targetDate).expectedOvertimeSalary}
                columns={salaryCalculationTableColumns}
            />
        </CardWrapper>
    )
}


const salaryCalculationTableColumns: ColumnDef<DummyOvertime>[] = [
    {
        accessorKey: 'clerkUserId',
        header: "User Id"
    },
    {
        accessorKey: 'month',
        header: "Month/Year",
        cell: ({ row: { original: { month, year } } }) => {

            return (
                <div className="flex flex-col items-start gap-1">
                    <CardTitle>{month}</CardTitle>
                    <CardDescription>
                        {year}
                    </CardDescription>
                </div>
            )
        }
    },
    {
        accessorKey: 'overtimeHour',
        header: "O.T Hours"
    },
    {
        accessorKey: 'collectedMoney',
        header: "Collection",
        cell: ({ row: { original: { isCollected, collectedMoney, overtimeHour, expectedOvertimeRate } } }) => {

            return (
                <Badge
                    variant={isCollected ? "success" : "destructive"}
                    className="rounded-full curser-pointer"
                    onClick={()=>alert('Collection Money modal open')}
                >
                    {collectedMoney
                        ? amountFormatter(collectedMoney)
                        : !isCollected && overtimeHour && expectedOvertimeRate
                            ? amountFormatter(overtimeHour * expectedOvertimeRate)
                            : "Pending"
                    }
                </Badge>

            )
        }
    },
    {
        accessorKey: 'overtimeRate',
        header: "Rate",
        cell: ({ row: { original: { overtimeRate } } }) => {
            return (overtimeRate?`${amountFormatter(overtimeRate)}/h`:null)
        }
    },
    {
        accessorKey: 'collectedDate',
        header: "Collection Date",
        cell: ({ row: { original: { collectedDate } } }) => {

            return (
                <>
                    {
                        collectedDate && (
                            <div className="flex flex-col items-start gap-1">
                                <CardTitle>{collectedDate && dateFormatter(collectedDate, "dd MMMM, yyyy")}</CardTitle>
                                <CardDescription>
                                    {dateFormatter(collectedDate)}
                                </CardDescription>
                            </div>
                        )
                    }
                </>
            )
        }
    },
    {
        accessorKey: 'expectedOvertimeRate',
        header: "Exp. Rate",
        cell: ({ row: { original: { expectedOvertimeRate } } }) => {
            return (`${amountFormatter(expectedOvertimeRate)}/h`)
        }
    },
]
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
import { dummyOvertimeSeed } from "@/constant/dummy-db/overtime-salary"
import { months } from "@/constant/month"

const salaryCalculationForm = z.object({
    currentDate: z.date(),
    targetDate: z.date(),

})


export const SalaryCalculation = () => {

    const [date, setDate] = useState<{ targetDate: Date, currentDate: Date; remainingMonth: number }>()

    const form = useForm({
        resolver: zodResolver(salaryCalculationForm),
        defaultValues: {
            currentDate: new Date(),
            targetDate: new Date()
        }
    })

    const { control, handleSubmit } = form

    function getRemainingMonths(targetDate: Date): number {
        const now = new Date();

        const yearsDiff = targetDate.getFullYear() - now.getFullYear();
        const monthsDiff = targetDate.getMonth() - now.getMonth();

        // total months difference
        let totalMonths = yearsDiff * 12 + monthsDiff;

        // if the target day is smaller than current day, subtract one month
        if (targetDate.getDate() < now.getDate()) {
            // totalMonths -= 1;
        }

        return totalMonths < 0 ? 0 : totalMonths;
    }

    const submit = handleSubmit((value) => {

        const remainingMonth = getRemainingMonths(value.targetDate)
        const overtimeSalaries = dummyOvertimeSeed.filter(ot => new Date(ot.createdAt) < new Date(new Date().setMonth(new Date().getMonth()-1)))
        const arr = Array.from({ length: remainingMonth }) || []
        const formattedArr = arr.map((_, i) => {
            const nows = new Date()
            const currentMont = nows.getMonth()+i
            const newDate = new Date(new Date().setMonth(currentMont))

            return {
                id: "string",
                clerkUserId: "string",
                month: format(newDate,'MMMM'),
                year: newDate.getFullYear().toString(),
                overtimeHour: 82,
                expectedOvertimeRate: 4.35,
                isCollected: false,
                collectedDate: null,
                collectedMoney: null,
                overtimeRate: null,
                createdAt: null,
                updatedAt: null,
            }
        })

        setDate({ ...value, remainingMonth })

        console.log({ ...value, remainingMonth, overtimeSalaries,formattedArr,combined:[...overtimeSalaries,...formattedArr] })
    })

    const arr = date?.remainingMonth && Array.from({ length: date.remainingMonth }) || []
    const formattedArr = arr.map(_ => {

        return {

        }
    })

    return (
        <CardWrapper
            title="Expected Salary Calculation"
            description="Calculation your expected salary for future"

        >

            {date && (
                <div>
                    <div>
                        <span>Current Date</span>
                        <span>{dateFormatter(date.currentDate)}</span>
                    </div>
                    <div>
                        <span>Target Date</span>
                        <span>{dateFormatter(date.targetDate)}</span>
                    </div>
                    <div>
                        <span>Remaining Month</span>
                        <span></span>
                    </div>
                </div>
            )}

            <Separator className="my-4" />
            <Form {...form}>
                <form
                    onSubmit={submit}
                    className="space-y-4"
                >
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
                    <Button
                        type="submit"
                    >
                        Calculate
                    </Button>
                </form>
            </Form>
            <Separator className="my-4" />
            <DataTable
                data={[]}
                columns={[
                    {
                        accessorKey: 'currentDate',
                        header: "Current Date",
                    },
                    {
                        accessorKey: 'targetDate',
                        header: "Target Date",
                    },
                    {
                        accessorKey: 'remainingMonth',
                        header: "Remaining Month",
                    },
                    {
                        accessorKey: 'salary',
                        header: "Salary",
                    },
                    {
                        accessorKey: 'overTimeHours',
                        header: "Overtime Hours",
                    },
                    {
                        accessorKey: 'overTimeRate',
                        header: "Overtime Rate",
                    },
                    {
                        accessorKey: 'overTimeSalary',
                        header: "Overtime Salary",
                    },
                    {
                        accessorKey: 'collectedOvertimeSalary',
                        header: "Collected Overtime Salary",
                        // cell: ({row}) => {
                        //     const formattedAmount = amountFormatter(row.original.collectedOvertimeSalary)
                        //     return 
                        // },
                    },
                ]}
            />
        </CardWrapper>
    )
}
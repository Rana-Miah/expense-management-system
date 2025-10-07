'use client'

import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormItem, FormLabel, FormMessage } from './ui/form'
import { Button } from './ui/button'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'


type DatePickerProps = {
    label: string;
    value: string | number | Date
} & React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}
export const DatePicker = ({ label, value, ...calendarProps }: DatePickerProps) => {
    return (
        <FormItem>
                            <FormLabel>Purchase date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !value && "text-muted-foreground"
                                            )}
                                        >
                                            {value ? (
                                                format(value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Calendar
                                        {...calendarProps}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
    )
}

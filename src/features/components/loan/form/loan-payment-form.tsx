'use client'
import { Loan } from '@/constant/dummy-db/loan'
import { loanPaymentCreateFormSchema, LoanPaymentCreateFormValue } from '@/features/schemas/loan/loan-payment'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
import { Label } from '@/components/ui/label'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { paymentType } from '@/drizzle/schema-helpers'
import { getFinancierById } from '@/constant/dummy-db/loan-financier'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { dummyBanks } from '@/constant/dummy-db/bank-account'

export const LoanPaymentForm = ({ loan }: { loan: Loan }) => {
  const { id, financierId } = loan

  const [selectedLoanFinancier, setSelectedLoanFinancier] = useState<string>()
  const [selectedBank, setSelectedBank] = useState<string>()
  const [selectedPaymentType, setSelectedPaymentType] = useState<typeof paymentType[number]>()
  const [amount, setAmount] = useState<number>(0)

  const form = useForm<LoanPaymentCreateFormValue>({
    resolver: zodResolver(loanPaymentCreateFormSchema),
    defaultValues: {
      loanId: id,
      financierId,
      amount: 0,
      paymentDate: new Date(),
    }
  })
  const { control, handleSubmit, reset } = form

  const onSubmitHandler = handleSubmit((value) => {
    console.log({ value })
  })



  //TODO: financier should included with loan
  const financierUnderLoan = getFinancierById(loan.financierId)

  const isDebit = loan.loanType == 'Debit'
  const isCredit = loan.loanType == 'Credit'

  return (
    <Form
      {...form}
    >
      <form className='space-y-4'>
        {/* Financier */}
        < FormField
          control={control}
          name="financierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Financier</FormLabel>
              <FormControl className="w-full">
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={financierUnderLoan?.name} />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value={loan.financierId} className="relative flex items-center justify-between">
                      <span>
                        {financierUnderLoan?.name}
                      </span>
                      <Badge
                        className='rounded-full'
                      >
                        {financierUnderLoan?.financierType}
                      </Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Loan */}
        < FormField
          control={control}
          name="loanId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan</FormLabel>
              <FormControl className="w-full">
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loan.title} />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value={loan.id} className="relative flex items-center justify-between">
                      <span>
                        {loan.title}
                      </span>
                      <Badge
                        className='rounded-full'
                      >
                        {loan.loanType}
                      </Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Type */}
        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Type</FormLabel>
              <FormControl className="w-full">
                <RadioGroup defaultValue={field.value} onValueChange={(value) => {
                  setSelectedPaymentType(value as typeof paymentType[number])
                  field.onChange(value)
                }} className="flex items-center gap-3">
                  {
                    paymentType.map(type => {
                      const isReceipt = type === 'Receipt'
                      const isPaid = type === 'Paid'

                      const hideReceipt = isDebit && isReceipt
                      const hidePaid = isCredit && isPaid

                      return (
                        <div
                          key={type}
                          className={cn("border-2 border-secondary px-3 py-2 rounded-sm", selectedPaymentType === type
                            ? type === 'Receipt'
                              ? "border-success"
                              : 'border-destructive'
                            : ""
                          )}
                          hidden={hideReceipt || hidePaid}
                        >
                          <RadioGroupItem value={type} id={type} hidden disabled={hideReceipt || hidePaid || amount > 0} />
                          <Label htmlFor={type}>{type}</Label>
                        </div>
                      )
                    })
                  }

                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* bank name */}
        {
          selectedPaymentType && (
            <>
              {isDebit && (
                < FormField
                  control={control}
                  name="sourceBankId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Bank</FormLabel>
                      <FormControl className="w-full">
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedBank(value)
                          }}
                          defaultValue={field.value}
                          disabled={amount > 0}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a source bank" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {
                              dummyBanks.map(bank => (
                                <SelectItem key={bank.id} value={bank.id} className="relative">
                                  {bank.name}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isCredit && (
                < FormField
                  control={control}
                  name="receiveBankId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receive Bank</FormLabel>
                      <FormControl className="w-full">
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedBank(value)
                          }}
                          defaultValue={field.value}
                          disabled={amount > 0}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a receive bank" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {
                              dummyBanks.map(item => (
                                <SelectItem key={item.id} value={item.id} className="relative">
                                  {item.name}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )
        }

        {/* amount */}
        {
          selectedBank && (
            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl className="w-full">
                    <Input
                      type='number'
                      placeholder="e.g. 150"
                      {...field}
                      onChange={(e) => {
                        setAmount(e.target.valueAsNumber)
                        field.onChange(e)
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }

        {/* date */}
        <FormField
          control={control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase date</FormLabel>
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
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* button */}
        <Button
          type="submit"
          className="w-full"
        >
          Create a loan
        </Button>
      </form>
    </Form>
  )
}

'use client'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, DollarSign, Landmark,Receipt,User } from 'lucide-react'

import { Loan } from '@/constant/dummy-db/loan'
import {
  loanPaymentCreateFormSchema,
  LoanPaymentCreateFormValue
} from '@/features/schemas/loan/loan-payment'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { paymentType } from '@/drizzle/schema-helpers'
import { InputField, SelectInput } from '@/components/input'
import { dummyBanks } from '@/constant/dummy-db/bank-account'
import { getFinancierById } from '@/constant/dummy-db/loan-financier'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'


export const LoanPaymentForm = ({ loan }: { loan: Loan }) => {
  const { id, financierId } = loan
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
    alert(JSON.stringify(value, null, 2))
  })



  //TODO: financier should included with loan
  const financierUnderLoan = getFinancierById(loan.financierId)

  const isDebit = loan.loanType == 'Debit'
  const isCredit = loan.loanType == 'Credit'

  return (
    <Form
      {...form}
    >
      <form
        className='space-y-4'
        onSubmit={onSubmitHandler}
      >
        {/* Financier */}

        < FormField
          control={control}
          name="financierId"
          render={({ field }) => (
            <SelectInput
              field={field}
              label='Financier'
              defaultValue={field.value}
              placeholder={financierUnderLoan?.name??""}
              disabled
              Icon={
                <User size={16} />
              }
              items={[{value:loan?.financierId??"not found",label:financierUnderLoan?.name??"not found",badgeLabel:financierUnderLoan?.financierType}]}
            />
          )}
        />


        {/*  Loan */}
        < FormField
          control={control}
          name="loanId"
          render={({ field }) => (
            <SelectInput
              field={field}
              label='Loan'
              defaultValue={field.value}
              placeholder={loan.title}
              disabled
              Icon={
                <Receipt size={16}/>
              }
              items={[{value:loan.id,label:loan.title,badgeLabel:loan.loanType}]}
            />
          )}
        />


        {/* Payment Type */}
        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Type</FormLabel>
              <FormControl className="w-full te">
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
                    <SelectInput
                      field={field}
                      items={dummyBanks.map(({ id, name }) => ({ value: id, label: name }))}
                      placeholder='Select a source bank'
                      label='Source Bank'
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedBank(value)
                      }}
                      disabled={amount > 0}
                      Icon={<Landmark size={16} />}
                    />

                  )}
                />
              )}

              {isCredit && (
                < FormField
                  control={control}
                  name="receiveBankId"
                  render={({ field }) => (
                    <SelectInput
                      items={dummyBanks.map(({ id, name }) => ({ value: id, label: name }))}
                      label='Receive Bank'
                      placeholder='Select a receive bank'
                      disabled={amount > 0}
                      field={field}
                      Icon={<Landmark size={16}/>}
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedBank(value)
                      }}
                    />
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
                <InputField
                  field={field}
                  label='Payment Amount'
                  type='number'
                  placeholder='e.g. 150'
                  onChange={(e) => {
                    setAmount(e.target.valueAsNumber)
                    field.onChange(e)
                  }}
                  Icon={<DollarSign size={16} className={cn(isCredit ? 'text-success' : 'text-destructive')} />}
                />
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
              <FormLabel>Payment date</FormLabel>
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

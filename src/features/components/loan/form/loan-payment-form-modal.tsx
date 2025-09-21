'use client'
import { dummyLoans, getLoanById, Loan } from '@/constant/dummy-db/loan'
import { loanPaymentCreateFormSchema, LoanPaymentCreateFormValue } from '@/features/schemas/loan/loan-payment'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
import { Label } from '@/components/ui/label'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, DollarSign, Landmark, Receipt, User } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { paymentType } from '@/drizzle/schema-helpers'
import { getFinancierById } from '@/constant/dummy-db/loan-financier'
import { cn } from '@/lib/utils'
import { dummyBanks } from '@/constant/dummy-db/bank-account'
import { InputField, SelectInput, SelectInputItem } from '@/components/input'

export const LoanPaymentFormModal = () => {

  const [selectedBank, setSelectedBank] = useState<string>()
  const [selectedPaymentType, setSelectedPaymentType] = useState<typeof paymentType[number]>()
  const [amount, setAmount] = useState<number>(0)

  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null)

  //TODO: financier should included with loan
  const loan = getLoanById(selectedLoanId ?? "")
  const financierUnderLoan = getFinancierById(loan?.financierId ?? "")

  const form = useForm<LoanPaymentCreateFormValue>({
    resolver: zodResolver(loanPaymentCreateFormSchema),
    defaultValues: {
      financierId: loan?.financierId,
      loanId: "",
      receiveBankId: "",
      sourceBankId: "",
      amount: 0,
      paymentDate: new Date(),
    }
  })
  const { control, handleSubmit, reset } = form

  const onSubmitHandler = handleSubmit((value) => {
    console.log({ value })
    alert(JSON.stringify(value, null, 2))
  })




  const isDebit = loan?.loanType == 'Debit'
  const isCredit = loan?.loanType == 'Credit'

  const modifieldSelectInputValue: SelectInputItem[] = dummyBanks.map(({ name, id }) => ({
    label: name,
    value: id
  }))

  return (
    <Form
      {...form}
    >
      <form
        className='space-y-4'
        onSubmit={onSubmitHandler}
      >

        {/*  Loan */}
        < FormField
          control={control}
          name="loanId"
          render={({ field }) => (
            <SelectInput
              field={field}
              label='All Loans'
              placeholder='Select a loan to pay'
              items={dummyLoans.map(({ id, title, loanType }) => {
                const isDebit = loanType === 'Debit'
                const isCredit = loanType === 'Credit'
                return {
                  value: id,
                  label: title,
                  badgeLabel: loanType,
                  badgeProp: {
                    className: 'rounded-full',
                    variant: isDebit
                      ? 'success'
                      : isCredit
                        ? 'destructive'
                        : 'default'
                  }
                }
              })}
              onValueChange={(v) => {
                field.onChange(v)
                setSelectedLoanId(v)
              }}
              Icon={<Receipt size={16} />
              }
            />
          )}
        />


        {/* Financier */}
        < FormField
          control={control}
          name="financierId"
          render={({ field }) => (
            <SelectInput
              field={field}
              label='Financier'
              defaultValue={field.value}
              placeholder={financierUnderLoan?.name ?? "Depended input not selected!"}
              // disabled
              Icon={<User size={16} />}
              items={[{
                label: financierUnderLoan?.name ?? "not-found",
                value: loan?.financierId ?? "not-found",
                badgeLabel: "hello",
                badgeProp: {
                  className: 'rounded-full'
                }
              }]}
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
                    <SelectInput
                      field={field}
                      label='Source Bank'
                      placeholder='Select a source bank'
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedBank(value)
                      }}
                      defaultValue={field.value}
                      disabled={amount > 0}
                      items={modifieldSelectInputValue}
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
                      field={field}
                      label='Receive Bank'
                      placeholder='Select a receive bank'
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedBank(value)
                      }}
                      defaultValue={field.value}
                      disabled={amount > 0}
                      items={modifieldSelectInputValue}
                      Icon={<Landmark size={16} />}
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
            <>
              <FormField
                control={control}
                name="amount"
                render={({ field }) => (
                  <InputField
                    field={field}
                    type='number'
                    label='Payment Amount'
                    placeholder='e.g. 150'
                    disabled={false}
                    onChange={(e) => {
                      setAmount(e.target.valueAsNumber)
                      field.onChange(e)
                    }}
                    Icon={<DollarSign size={16} className={cn(isCredit ? 'text-success' : 'text-destructive')} />}
                  />
                )}
              />
            </>
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

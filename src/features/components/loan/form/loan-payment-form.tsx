'use client'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DollarSign, Landmark, Receipt, User } from 'lucide-react'

import {
  loanPaymentCreateFormSchema,
  LoanPaymentCreateFormValue
} from '@/features/schemas/loan/loan-payment'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { paymentType } from '@/drizzle/schema-helpers'
import { InputField, SelectInput, TextAreaField } from '@/components/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
import { DateTimePicker } from '@/components/ui/extension/date-picker'
import { disableCalendarDay } from '@/lib/disable-calendar-day'
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'
import { createLoanPaymentAction } from '@/features/actions/loan-payment/create-loan-payment-action'
import { generateToasterDescription } from '@/lib/helpers'
import { toast } from 'sonner'
import { SubmitButton } from '@/components/submit-button'


export const LoanPaymentForm = ({ loan, banks }: {
  loan: {
    id: string;
    loanType: "Debit" | "Credit";
    title: string;
    due: number;
    financier: {
      id: string;
      name: string;
      isDeleted: boolean;
      financierType: "Both" | "Provider" | "Recipient";
    };
  },
  banks: {
    id: string;
    name: string;
    balance: number;
    isActive: boolean;
    assignedTransactionsName: {
      id: string;
      transactionName: {
        id: string;
        name: string;
        isActive: boolean;
      };
    }[];
  }[]
}) => {
  const { id, financier, due, loanType, title } = loan
  const [pending, startTransition] = useTransition()

  const form = useForm<LoanPaymentCreateFormValue>({
    resolver: zodResolver(loanPaymentCreateFormSchema),
    defaultValues: {
      loanId: id,
      financierId: financier.id,
      amount: 0,
      paymentDate: new Date(),
      paymentNote: "",
    }
  })
  const { control, handleSubmit, watch } = form

  const watchBank = () => {
    const selectedSourceValue = watch('sourceBankId')
    const selectedReceiveValue = watch('receiveBankId')
    if (!selectedSourceValue && !selectedReceiveValue) return ""

    if (selectedReceiveValue) return selectedReceiveValue
    if (selectedSourceValue) return selectedSourceValue
    return ""
  }

  const selectedPaymentType = watch('paymentType')
  const amount = watch('amount')
  const selectedBankId = watchBank()

  const onSubmitHandler = handleSubmit((value) => {
    startTransition(
      async () => {
        const res = await createLoanPaymentAction(value)
        const description = generateToasterDescription()
        if (!res.success) {
          toast.error(res.message, { description })
          if (res.isError) {
            console.log({ errorResponse: res })
          }
          return
        }
        toast.success(res.message, { description })
      }
    )
  })



  const isDebit = loanType == 'Debit'
  const isCredit = loanType == 'Credit'

  const selectedBank = banks.find(bank => bank.id === selectedBankId)

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
              {...field}
              label='Financier'
              defaultValue={field.value}
              placeholder={financier.name}
              disabled
              Icon={<User size={16} />}
              items={[{
                value: financier?.id ?? "not found", label: financier?.name ?? "not found",
                badgeLabel: financier?.financierType || "", badgeProp: {}
              }]}
            />
          )}
        />


        {/*  Loan */}
        < FormField
          control={control}
          name="loanId"
          render={({ field }) => (
            <SelectInput
              {...field}
              label='Loan'
              defaultValue={field.value}
              placeholder={title}
              disabled
              Icon={
                <Receipt size={16} />
              }
              items={[{ value: id, label: title, badgeLabel: `${loanType}-${due} Remaining`, badgeProp: {} }]}
            />
          )}
        />


        {/* Payment Type */}
        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <FormControl className="w-full te">
                <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex items-center gap-3">
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
                      {...field}
                      items={banks.map(({ id, name, isActive, balance }) => ({
                        value: id,
                        label: name,
                        disabled: !isActive,
                        badgeLabel: balance.toString(),
                        badgeProp: {}
                      }))}
                      placeholder='Select a source bank'
                      label='Source Bank'
                      onValueChange={field.onChange}
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
                      items={banks.map(({ id, name, isActive, balance }) => ({
                        value: id,
                        label: name,
                        disabled: !isActive,
                        badgeLabel: balance.toString(),
                        badgeProp: {}
                      }))}
                      label='Receive Bank'
                      placeholder='Select a receive bank'
                      disabled={amount > 0}
                      Icon={<Landmark size={16} />}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    />
                  )}
                />
              )}
            </>
          )
        }

        < FormField
          control={control}
          name="trxNameId"
          render={({ field }) => (
            <SelectInput
              items={
                selectedBank
                  ? selectedBank.assignedTransactionsName?.map(({ transactionName }) => ({
                    value: transactionName.id,
                    label: transactionName.name,
                    disabled: !transactionName.isActive,
                  }))
                  : []
              }
              label='Transaction Name'
              placeholder='Select a transaction name'
              disabled={amount > 0 || !selectedBankId}
              Icon={<Landmark size={16} />}
              onValueChange={(value) => {
                field.onChange(value)
              }}
              defaultValue={field.value}
            />
          )}
        />



        {/* amount */}
        {
          selectedBankId && (
            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <InputField
                  {...field}
                  label='Payment Amount'
                  type='number'
                  placeholder='e.g. 150'
                  onChange={field.onChange}
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
              <DateTimePicker
                {...field}
                isCalenderInsideModal={false}
                onChange={field.onChange}
                disableCalendarDay={disableCalendarDay(new Date())}
                value={field.value}
              />
              <FormMessage />
            </FormItem>
          )}
        />


        {/* payment note */}
        <FormField
          control={control}
          name="paymentNote"
          render={({ field }) => (
            <TextAreaField
              label='Payment note'
              placeholder='e.g. 500 tk er note diche bridge er opor'
              {...field}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />

        {/* button */}
        <SubmitButton
          buttonLabel={
            selectedPaymentType === "Paid" ? "Pay Loan" : "Receive Loan Payment"
          }
          pending={pending}
          pendingStateLabel={
            selectedPaymentType === "Paid" ? "Paying Loan..." : "Receiving Loan Payment..."
          }
        />
      </form>
    </Form>
  )
}

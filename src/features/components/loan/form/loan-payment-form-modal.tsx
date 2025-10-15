'use client'
import { loanPaymentCreateFormSchema, LoanPaymentCreateFormValue } from '@/features/schemas/loan/loan-payment'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
import { Label } from '@/components/ui/label'

import { Button } from '@/components/ui/button'
import { CalendarIcon, DollarSign, Landmark, Receipt, User } from 'lucide-react'
import { paymentType } from '@/drizzle/schema-helpers'
import { cn } from '@/lib/utils'
import { InputField, SelectInput, SelectInputItem } from '@/components/input'
import { DateTimePicker } from '@/components/ui/extension/date-picker'
import { disableCalendarDay } from '@/lib/disable-calendar-day'

export const LoanPaymentFormModal = (
  {
    loans, banks
  }: {
    loans: {
      id: string;
      loanType: "Debit" | "Credit" | "Both";
      title: string;
      due: number;
      financier: {
        id: string;
        name: string;
        financierType: "Both" | "Provider" | "Recipient";
      };
    }[];
    banks: {
      id: string;
      name: string;
      balance: number;
      assignedTransactionsName: {
        id: string;
        transactionName: {
          id: string;
          name: string;
          isActive: boolean;
        };
      }[];
    }[]
  }
) => {

  const [selectedBankId, setSelectedBankId] = useState<string>("")
  const [selectedPaymentType, setSelectedPaymentType] = useState<typeof paymentType[number]>()
  const [amount, setAmount] = useState<number>(0)

  const [selectedLoanId, setSelectedLoanId] = useState<string>("")

  //TODO: financier should included with loan
  const selectedLoan = loans.find(loan => loan.id === selectedLoanId)
  const selectedBank = banks.find(bank => bank.id === selectedBankId)

  const form = useForm<LoanPaymentCreateFormValue>({
    resolver: zodResolver(loanPaymentCreateFormSchema),
    defaultValues: {
      financierId: selectedLoan?.financier.id,
      loanId: "",
      trxNameId: "",
      receiveBankId: "",
      sourceBankId: "",
      amount: 0,
      paymentDate: new Date(),
    }
  })
  const { control, handleSubmit, reset, resetField } = form

  const onSubmitHandler = handleSubmit((value) => {
    console.log({ value })
    alert(JSON.stringify(value, null, 2))
  })




  const isDebit = selectedLoan?.loanType == 'Debit'
  const isCredit = selectedLoan?.loanType == 'Credit'

  const modifiedSelectInputValue: SelectInputItem[] = banks.map(({ name, id }) => ({
    label: name,
    value: id
  }))

  console.log({ selectedLoan })

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
              {...field}
              label='All Loans'
              placeholder='Select a loan to pay'
              items={loans.map(({ id, title, loanType }) => {
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
                resetField('financierId')

              }}
              Icon={<Receipt size={16} />
              }
            />
          )}
        />


        {/* Financier */}
        {
          selectedLoan && (
            < FormField
              control={control}
              name="financierId"
              render={({ field }) => (
                <SelectInput
                  {...field}
                  label='Financier'
                  value={field.value}
                  onValueChange={(financier => {
                    field.onChange(financier)
                    resetField('paymentType')
                  })}
                  placeholder={"Depended input not selected!"}
                  Icon={<User size={16} />}
                  items={[{
                    label: selectedLoan.financier.name,
                    value: selectedLoan.financier.id,
                    badgeLabel: selectedLoan.financier.financierType,
                    badgeProp: {
                      className: 'rounded-full'
                    }
                  }]}
                />
              )}
            />
          )
        }

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
                  resetField('sourceBankId')
                  resetField('receiveBankId')
                  resetField('trxNameId')
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
                      {...field}
                      label='Source Bank'
                      placeholder='Select a source bank'
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedBankId(value)
                        resetField('trxNameId')
                      }}
                      defaultValue={field.value}
                      disabled={amount > 0 || !selectedPaymentType}
                      items={modifiedSelectInputValue}
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
                      {...field}
                      label='Receive Bank'
                      placeholder='Select a receive bank'
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedBankId(value)
                      }}
                      defaultValue={field.value}
                      disabled={amount > 0}
                      items={modifiedSelectInputValue}
                      Icon={<Landmark size={16} />}
                    />
                  )}
                />
              )}
            </>
          )
        }

        {/* amount */}

        < FormField
          control={control}
          name="trxNameId"
          render={({ field }) => (
            <SelectInput
              {...field}

              label='Transaction Name'
              placeholder='Select a transaction name'
              defaultValue={field.value}
              onValueChange={(value) => {
                field.onChange(value)
                resetField('trxNameId')
              }}
              disabled={amount > 0 || !selectedPaymentType}
              items={selectedBank ? selectedBank.assignedTransactionsName.map(({ id, transactionName }) => {
                return {
                  label: transactionName.name,
                  value: transactionName.id
                }
              }) : []}
              Icon={<Landmark size={16} />}
            />
          )}
        />

        {/* amount */}
        {
          selectedBankId && (
            <>
              <FormField
                control={control}
                name="amount"
                render={({ field }) => (
                  <InputField
                    {...field}
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
              <DateTimePicker
                isCalenderInsideModal
                disableCalendarDay={disableCalendarDay(new Date())}
                value={field.value}
                onChange={field.onChange}
              />
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

'use client'
import { loanCreateFormSchema, LoanCreateFormValue } from '@/features/schemas/loan/loan-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { dummyBanks } from '@/constant/dummy-db/bank-account'
import { trxType as loanType } from '@/drizzle/schema-helpers'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Financier, BankWithAssignedTrxName } from '@/drizzle/type'
import { DateTimePicker } from '@/components/ui/extension/date-picker'
import { disableCalendarDay } from '@/lib/disable-calendar-day'
import { SelectInput } from '@/components/input'

export const LoanForm = ({ financiers, banks }: { financiers: Financier[], banks: BankWithAssignedTrxName[] }) => {

  //TODO: fetch Bank From db
  const [selectedLoanFinancier, setSelectedLoanFinancier] = useState<string>()
  const [selectedBank, setSelectedBank] = useState<string>()
  const [selectedLoanType, setSelectedLoanType] = useState<typeof loanType[number]>()
  const [amount, setAmount] = useState<number>(0)

  const isDebit = selectedLoanType === 'Debit'
  const isCredit = selectedLoanType === 'Credit'

  const form = useForm<LoanCreateFormValue>({
    resolver: zodResolver(loanCreateFormSchema),
    defaultValues: {
      title: "",
      amount: 0,
      financierId: "",
      sourceBankId: "",
      receiveBankId: "",
      loanDate: new Date(),
    }
  })
  const { control, handleSubmit } = form

  const onSubmitHandler = handleSubmit((value) => {
    console.log({ value })
  })

  const selectedFinancier = financiers.find(financier => financier.id === selectedLoanFinancier)

  const isBoth = selectedFinancier?.financierType === 'Both'
  const isProvider = selectedFinancier?.financierType === 'Provider' || isBoth
  const isRecipient = selectedFinancier?.financierType === 'Recipient' || isBoth


  console.log({
    isBoth,
    isProvider,
    isRecipient,
    selectedFinancier,
  })


  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler} className={cn("space-y-4 max-w-full")}>

        <div className='max-h-[300px] overflow-y-auto space-y-4 max-w-full'>


          {/* Financier */}
          < FormField
            control={control}
            name="financierId"
            render={({ field }) => (
              <SelectInput
                label='Financier'
                placeholder='Select a loan financier'
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedLoanFinancier(value)
                }}
                defaultValue={field.value}

                items={financiers.map(({ id, name, isBan, isBothFinancierBan }) => ({
                  value: id,
                  label: name,
                  disabled: isBothFinancierBan,
                  badgeLabel: isBothFinancierBan ? "Banned" : isBan ? "Provider" : "",
                  badgeProp: { variant: isBothFinancierBan ? "destructive" : isBan ? "warning" : "default" }
                }))}
              />
            )}
          />

          {/* Loan Type */}
          {
            selectedLoanFinancier && (
              <FormField
                control={form.control}
                name="loanType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Type</FormLabel>
                    <FormControl className="w-full">
                      <RadioGroup defaultValue={field.value} onValueChange={(value) => {
                        setSelectedLoanType(value as typeof loanType[number])
                        field.onChange(value)
                      }} className="flex items-center gap-3">
                        {
                          loanType.map(type => {
                            const isDebit = type === 'Debit'
                            const isCredit = type === 'Credit'

                            const hideCredit = isCredit && !isRecipient && !isBoth
                            const hideDebit = isDebit && !isProvider && !isBoth

                            return (
                              <div
                                key={type}
                                className={cn("border-2 border-secondary px-3 py-2 rounded-sm", selectedLoanType === type
                                  ? type === 'Debit'
                                    ? "border-success"
                                    : 'border-destructive'
                                  : ""
                                )}
                                hidden={hideCredit || hideDebit}
                              >
                                <RadioGroupItem value={type} id={type} hidden disabled={hideCredit || hideDebit} />
                                <Label htmlFor={type}
                                  hidden={hideCredit || hideDebit}
                                >{type}</Label>
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
            )
          }

          {/* bank name */}
          {
            selectedLoanType && (
              <>
                {isCredit && (

                  < FormField
                    control={control}
                    name="sourceBankId"
                    render={({ field }) => (
                      <SelectInput
                        label='Source Bank'
                        placeholder='Select a source bank'
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedBank(value)
                        }}
                        defaultValue={field.value}

                        items={banks.map(({ id, name, isActive, balance }) => ({
                          value: id,
                          label: name,
                          disabled: !isActive,
                          badgeLabel: balance.toString(),
                          badgeProp: {}
                        }))}
                      />
                    )}
                  />
                )}

                {isDebit && (
                  < FormField
                    control={control}
                    name="receiveBankId"
                    render={({ field }) => (
                      <SelectInput
                        label='Receive Bank'
                        placeholder='Select a receive bank'
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedBank(value)
                        }}
                        defaultValue={field.value}

                        items={banks.map(({ id, name, isActive, balance }) => ({
                          value: id,
                          label: name,
                          disabled: !isActive,
                          badgeLabel: balance.toString(),
                          badgeProp: {}
                        }))}
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
            name="loanDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Date</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    disableCalendarDay={disableCalendarDay()}
                    isCalenderInsideModal
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* description */}
          <FormField
            control={control}
            name="detailsOfLoan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl className="w-full">
                  <Textarea
                    {...field}
                    placeholder='Description'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        {/* button */}
        <Button
          type="submit"
          className="w-full"
        >
          Create a loan
        </Button>
      </form>
    </Form >
  )
}

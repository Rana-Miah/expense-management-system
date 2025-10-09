'use client'
import { loanCreateFormSchema, LoanCreateFormValue } from '@/features/schemas/loan/loan-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { trxType as loanType } from '@/drizzle/schema-helpers'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Financier, BankWithAssignedTrxName } from '@/drizzle/type'
import { DateTimePicker } from '@/components/ui/extension/date-picker'
import { disableCalendarDay } from '@/lib/disable-calendar-day'
import { InputField, SelectInput, TextAreaField } from '@/components/input'
import { createLoanAction } from '@/features/actions/loan/create-action'
import { toast } from 'sonner'
import { generateToasterDescription } from '@/lib/helpers'
import { useModalClose } from '@/hooks/redux'
import { useRedirect } from '@/hooks/use-redirect'
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'

export const LoanForm = ({ financiers, banks }: { financiers: Financier[], banks: BankWithAssignedTrxName[] }) => {


  const [pending, startTransition] = useTransition()
  const [selectedLoanFinancierId, setSelectedLoanFinancierId] = useState<string>()
  const [selectedBankId, setSelectedBankId] = useState<string>()
  const [selectedLoanType, setSelectedLoanType] = useState<typeof loanType[number]>()
  const [amount, setAmount] = useState<number>(0)
  const onCloseModal = useModalClose()
  useRedirect(banks.length < 1, '/', () => {
    if (banks.length < 1) toast.warning('Please first create a bank!')
  })


  const selectedFinancier = financiers.find(financier => financier.id === selectedLoanFinancierId)
  const selectedBank = banks.find(bank => bank.id === selectedBankId)

  const condition = !!selectedBank && selectedBank.assignedTransactionsName.length < 1
  useRedirect(condition, `/accounts/${selectedBank?.id}/assign-trx-name`, () => {
    if(condition)toast.warning('Please assign transaction name!')
  })

  const isBoth = selectedFinancier?.financierType === 'Both'
  const isProvider = selectedFinancier?.financierType === 'Provider' || isBoth
  const isRecipient = selectedFinancier?.financierType === 'Recipient' || isBoth

  const isDebit = selectedLoanType === 'Debit'
  const isCredit = selectedLoanType === 'Credit'

  const form = useForm<LoanCreateFormValue>({
    resolver: zodResolver(loanCreateFormSchema),
    defaultValues: {
      title: "",
      financierId: "",
      sourceBankId: "",
      receiveBankId: "",
      loanDate: new Date(),
      amount: 0,
    }
  })
  const { control, handleSubmit, resetField, reset } = form

  const onSubmitHandler = handleSubmit((value) => {
    startTransition(
      async () => {
        const res = await createLoanAction(value)
        console.log({res})
        if (!res.success) {
          const description = generateToasterDescription()
          toast.error(res.message, { description })
          if (res.isError) {
            console.log({ errorResponse: res });
          }
          return
        }

        toast.success(res.message)
        // onCloseModal()
        // reset()

      }
    )
  })




  if (banks.length < 1) {
    return null
  }


  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler} className={cn("space-y-4 max-w-full")}>

        <div className='max-h-[300px] overflow-y-auto space-y-4 max-w-full'>

          {/* Loan title */}
          <FormField
            control={control}
            name='title'
            render={({ field }) => (
              <InputField
                {...field}
                label="Loan title"
                placeholder='e.g. Bazar korte hoibo'
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />

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
                  setSelectedLoanFinancierId(value)
                  resetField('loanType')
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
                    resetField('sourceBankId')
                    resetField('receiveBankId')
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

          {/* bank name */}

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
                    setSelectedBankId(value)
                    resetField('receiveBankId')
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
                  // {...field}
                  label='Receive Bank'
                  placeholder='Select a receive bank'
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedBankId(value)
                    resetField('sourceBankId')
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

          < FormField
            control={control}
            name="trxNameId"
            render={({ field }) => (
              <SelectInput
                // {...field}
                label='Transaction name'
                placeholder='Select a transaction name'
                onValueChange={field.onChange}
                defaultValue={field.value}

                items={selectedBank?.assignedTransactionsName?.map(({ transactionName: { id, name, isActive } }) => ({
                  value: id,
                  label: name,
                  disabled: !isActive,
                })) || []}
              />
            )}
          />

          {/* amount */}
          <FormField
            control={control}
            name="amount"
            render={({ field }) => (
              <InputField
                {...field}
                label="Payment Amount"
                placeholder='e.g. 150'
                onChange={(e) => {
                  setAmount(e.target.valueAsNumber)
                  field.onChange(e)
                }}
                value={field.value}
              />
            )}
          />

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
                    disableCalendarDay={disableCalendarDay(new Date())}
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
              <TextAreaField
                {...field}
                label='Description (optional)'
                placeholder='Write something...'
              />
            )}
          />

        </div>

        {/* button */}
        {
          pending?(
            <TextShimmerWave className='W-full'>Creating Loan...</TextShimmerWave>
          ):(<Button
          type="submit"
          className="w-full"
        >
          Create a loan
        </Button>)
        }
      </form>
    </Form >
  )
}

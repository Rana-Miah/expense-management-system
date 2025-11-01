'use client'
import { loanCreateFormSchema, LoanCreateFormValue } from '@/features/schemas/loan/loan-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { trxType as loanType } from '@/drizzle/schema-helpers'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Financier, LoanTrxName } from '@/drizzle/type'
import { DateTimePicker } from '@/components/ui/extension/date-picker'
import { disableCalendarDay } from '@/lib/disable-calendar-day'
import { InputField, SelectInput, TextAreaField } from '@/components/input'
import { createLoanAction } from '@/features/actions/loan/create-action'
import { toast } from 'sonner'
import { generateToasterDescription } from '@/lib/helpers'
import { useModalClose } from '@/hooks/redux'
import { useRedirect } from '@/hooks/use-redirect'
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'
import { SubmitButton } from '@/components/submit-button'

export const LoanForm = ({ financiers, trxNames }: { financiers: Financier[], trxNames: LoanTrxName[] }) => {
  //REACT HOOKS
  const [pending, startTransition] = useTransition()

  // REACT REDUX HOOKS
  const onCloseModal = useModalClose()

  // REACT FORM HOOKS
  const form = useForm<LoanCreateFormValue>({
    resolver: zodResolver(loanCreateFormSchema),
    defaultValues: {
      title: "",
      financierId: "",
      sourceBankId: "",
      receiveBankId: "",
      loanType: '',
      detailsOfLoan: "",
      trxNameId: "",
      loanDate: new Date(),
      amount: 0,
    }
  })
  const { control, handleSubmit, resetField, reset, watch } = form

  // VARIABLES
  const watchBank = () => {
    const selectedSourceValue = watch('sourceBankId')
    const selectedReceiveValue = watch('receiveBankId')
    if (!selectedSourceValue && !selectedReceiveValue) return ""

    if (selectedReceiveValue) return selectedReceiveValue
    if (selectedSourceValue) return selectedSourceValue
    return ""
  }

  const selectedFinancierId = watch('financierId')
  const selectedTrxNameId = watch('trxNameId')
  const selectedBankId = watchBank()
  const selectedType = watch('loanType')

  const isDebitLoanType = selectedType === 'Debit'
  const isCreditLoanType = selectedType === 'Credit'

  // CUSTOM HOOKS
  useRedirect(trxNames.length < 1, '/', () => {
    if (trxNames.length < 1) toast.warning('Please first create a bank!')
  })


  const isDebit = selectedType === 'Debit'
  const isCredit = selectedType === 'Credit'
  const selectedFinancier = financiers.find(financier => financier.id === selectedFinancierId)
  const selectedTrxName = trxNames.find(trxName => trxName.id === selectedTrxNameId)
  const isBothFinancier = selectedFinancier && selectedFinancier.financierType === 'Both'
  const isProviderFinancier = (selectedFinancier && selectedFinancier.financierType === 'Provider') || isBothFinancier
  const isRecipientFinancier = (selectedFinancier && selectedFinancier.financierType === 'Recipient') || isBothFinancier

  const receiveBanks = (isProviderFinancier && selectedTrxName) ? selectedTrxName.receiveBanks : []
  const sourceBanks = (isRecipientFinancier && selectedTrxName) ? selectedTrxName.sourceBanks : []

  const onSubmitHandler = handleSubmit((value) => {
    startTransition(
      async () => {
        const res = await createLoanAction(value)
        console.log({ res })
        if (!res.success) {
          const description = generateToasterDescription()
          toast.error(res.message, { description })
          if (res.isError) {
            console.log({ errorResponse: res });
          }
          return
        }

        toast.success(res.message)
        onCloseModal()
        reset()

      }
    )
  })




  if (trxNames.length < 1) {
    return null
  }

  console.log({
    selectedFinancier,
    isBothFinancier,
    isProviderFinancier,
    isRecipientFinancier
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler} className={cn("space-y-4 max-w-full")}>

        <div className='max-h-[300px] overflow-y-auto space-y-4 max-w-full px-1'>

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
                  resetField('loanType')
                }}
                defaultValue={field.value}

                items={financiers.map(({ id, name, isBlock, isBothFinancierBlock }) => ({
                  value: id,
                  label: name,
                  disabled: isBothFinancierBlock,
                  badgeLabel: isBothFinancierBlock ? "Banned" : isBlock ? "Provider" : "",
                  badgeProp: { variant: isBothFinancierBlock ? "destructive" : isBlock ? "warning" : "default" }
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
                  <RadioGroup
                    defaultChecked={false}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      resetField('sourceBankId')
                      resetField('receiveBankId')
                      resetField('loanType')
                    }} className="flex items-center gap-3">
                    {
                      loanType.map(type => {
                        const isDebit = type === 'Debit'
                        const isCredit = type === 'Credit'


                        const hideCredit = isCredit && isRecipientFinancier !== undefined && !isRecipientFinancier
                        const hideDebit = isDebit && isProviderFinancier !== undefined && !isProviderFinancier

                        console.log({
                          type,
                          isDebit,
                          isCredit,
                          hideDebit,
                          hideCredit
                        })
                        return (
                          <div
                            key={type}
                            className={cn("border-2 border-accent w-20 h-10 rounded-sm disabled:text-accent", selectedType === type
                              ? type === 'Debit'
                                ? "border-success"
                                : 'border-destructive'
                              : ""
                            )}
                            hidden={hideCredit || hideDebit}
                          >
                            <RadioGroupItem
                              hidden
                              id={type}
                              value={type}
                              disabled={pending || hideCredit || hideDebit}
                            />
                            <Label
                              htmlFor={type}
                              className='w-full h-full flex items-center justify-center'
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

                items={
                  trxNames.map(({ id, name, isActive }) => ({
                    value: id,
                    label: name,
                    disabled: !isActive,
                  }))
                }
              />
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
                    resetField('receiveBankId')
                  }}
                  defaultValue={field.value}
                  items={sourceBanks.map(({ sourceBank: { name, id, isActive, balance } }) => ({
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
                    resetField('sourceBankId')
                  }}
                  defaultValue={field.value}

                  items={receiveBanks.map(({ receiveBank: { id, name, isActive } }) => ({
                    value: id,
                    label: name,
                    disabled: !isActive,
                  }))}
                />
              )}
            />
          )}



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
        <SubmitButton
          buttonLabel="Create Loan"
          pending={pending}
          pendingStateLabel="Creating Loan..."
        />
      </form>
    </Form >
  )
}

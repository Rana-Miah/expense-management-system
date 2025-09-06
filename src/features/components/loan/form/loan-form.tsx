import { loanCreateFormSchema, LoanCreateFormValue } from '@/features/schemas/loan/loan-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { dummyBanks } from '@/constant/dummy-db/bank-account'
import { trxType as loanType } from '@/drizzle/schema-helpers'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { dummyLoanFinanciers } from '@/constant/dummy-db/loan-financier'

export const LoanForm = () => {

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

  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler} className={cn("space-y-4 max-w-full")}>

        {/* Financier */}
        < FormField
          control={control}
          name="financierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Financier</FormLabel>
              <FormControl className="w-full">
                <Select onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedLoanFinancier(value)
                }} defaultValue={field.value} >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Financier" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {
                      dummyLoanFinanciers.map(item => (
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
                        loanType.map(type => (
                          <div
                            key={type}
                            className={cn("border-2 border-secondary px-3 py-2 rounded-sm", selectedLoanType === type && "border-primary")}
                          >
                            <RadioGroupItem value={type} id={type} hidden />
                            <Label htmlFor={type}>{type}</Label>
                          </div>
                        ))
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
                    <FormItem>
                      <FormLabel>Source Bank</FormLabel>
                      <FormControl className="w-full">
                        <Select onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedBank(value)
                        }} defaultValue={field.value} >
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

              {isDebit && (
                < FormField
                  control={control}
                  name="receiveBankId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receive Bank</FormLabel>
                      <FormControl className="w-full">
                        <Select onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedBank(value)
                        }} defaultValue={field.value} >
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
          name="loanDate"
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

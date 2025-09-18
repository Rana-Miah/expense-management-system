"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { financierTypeWithBoth } from "@/drizzle/schema-helpers"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { loanFinancierCreateFormSchema, LoanFinancierCreateFormValue } from "@/features/schemas/loan"




export const LoanFinancierForm = () => {
  const [seletedFinancierType, setSeletedFinancierType] = useState<typeof financierTypeWithBoth[number] | null>(null)


  // 1. Define your form.
  const form = useForm<LoanFinancierCreateFormValue>({
    resolver: zodResolver(loanFinancierCreateFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      totalProvided: 0,
      totalReceipt: 0,
    },
  })
  const { control, handleSubmit } = form
  // 2. Define a submit handler.
  const onSubmit = handleSubmit(values => {
    console.log({ values })
  })

  const isFinancierProvider = seletedFinancierType === 'Provider'
  const isFinancierRecipient = seletedFinancierType === 'Recipient'
  const isFinancierBoth = seletedFinancierType === 'Both'

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={cn("space-y-4 max-w-full")}>

        {/* Financier Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Financier Name</FormLabel>
              <FormControl className="w-full">
                <Input
                  {...field}
                  type="text"
                  placeholder="e.g. Ajijul Islam"
                  disabled={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Financier Phone */}
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Financier Phone</FormLabel>
              <FormControl className="w-full">
                <Input
                  {...field}
                  type="number"
                  placeholder="e.g. 01xxxxxxxxx"
                  disabled={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transaction Variant */}
        <FormField
          control={control}
          name="financierType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Variant</FormLabel>
              <FormControl className="w-full">
                <RadioGroup defaultValue={field.value} onValueChange={(value) => {
                  setSeletedFinancierType(value as typeof financierTypeWithBoth[number])
                  console.log({ value })
                  field.onChange(value)
                }} className="flex items-center gap-3">
                  {
                    financierTypeWithBoth.map(variant => (
                      <div className={cn("border-2 border-secondary px-3 py-2 rounded-sm", seletedFinancierType === variant && "border-primary")} key={variant}>
                        <RadioGroupItem value={variant} id={variant} hidden />
                        <Label htmlFor={variant}>{variant}</Label>
                      </div>
                    ))
                  }

                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* provided total amount */}
        {
          (isFinancierBoth || isFinancierRecipient) && (
            <FormField
              control={control}
              name="totalReceipt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receipt Amount</FormLabel>
                  <FormControl className="w-full">
                    <Input
                      type='number'
                      placeholder="e.g. 15"
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }


        {/* recipient total amount */}
        {
          (isFinancierBoth || isFinancierProvider) && (
            <FormField
              control={control}
              name="totalProvided"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provided Amount</FormLabel>
                  <FormControl className="w-full">
                    <Input
                      type='number'
                      placeholder="e.g. 15"
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }

        {/* button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form >
  )
}
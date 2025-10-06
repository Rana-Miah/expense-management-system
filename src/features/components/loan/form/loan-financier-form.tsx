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
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { loanFinancierCreateFormSchema, LoanFinancierCreateFormValue } from "@/features/schemas/loan"
import { createLoanFinancierAction } from "@/features/actions/loan-financier/create-action"
import { toast } from "sonner"
import { generateToasterDescription } from "@/lib/helpers"
import { useModalClose } from "@/hooks/redux"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"




export const LoanFinancierForm = () => {
  const [selectedFinancierType, setSelectedFinancierType] = useState<typeof financierTypeWithBoth[number] | null>(null)
  const [pending, startTransition] = useTransition()
  const closeModal = useModalClose()


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
    startTransition(
      async () => {
        const res = await createLoanFinancierAction(values)
        const description = generateToasterDescription()
        if (!res.success) {
          toast.error(res.message, { description })
          if (res.isError) {
            toast.error(res.errorMessage, { description })
          }
          return
        }

        toast.success(res.message, { description })
        closeModal()
      }
    )
  })

  const isFinancierProvider = selectedFinancierType === 'Provider'
  const isFinancierRecipient = selectedFinancierType === 'Recipient'
  const isFinancierBoth = selectedFinancierType === 'Both'

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
                  disabled={pending}
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
                  disabled={pending}
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
                  setSelectedFinancierType(value as typeof financierTypeWithBoth[number])
                  console.log({ value })
                  field.onChange(value)
                }} className="flex items-center gap-3">
                  {
                    financierTypeWithBoth.map(variant => (
                      <div className={cn("border-2 border-secondary px-3 py-2 rounded-sm", selectedFinancierType === variant && "border-primary")} key={variant}>
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
        <div className="flex items-center justify-center w-full">
          {
            pending ? (
              <TextShimmerWave className="w-full">Creating loan financier...</TextShimmerWave>
            ) : (<Button className="w-full" type="submit">Submit</Button>)
          }
        </div>
      </form>
    </Form >
  )
}
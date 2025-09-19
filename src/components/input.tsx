"use client"

import { Input} from "@/components/ui/input"
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"

type InputFieldProp<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  label: string
  field: ControllerRenderProps<TFieldValues, TName>
} & React.ComponentProps<"input">

export function InputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  label,
  field,
  ...inputProps
}: InputFieldProp<TFieldValues, TName>) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          {...inputProps}
          {...field}
          value={field.value ?? ""}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

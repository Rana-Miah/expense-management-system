"use client"

import { VariantProps } from "class-variance-authority"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge, badgeVariants } from "./ui/badge"
import { LucideProps } from "lucide-react"
import { JSX } from "react"


type InputFieldProp<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  label: string;
  Icon?: JSX.Element;
  // Icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  field: ControllerRenderProps<TFieldValues, TName>;
} & React.ComponentProps<"input">

export function InputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  label,
  field,
  Icon,
  ...inputProps
}: InputFieldProp<TFieldValues, TName>) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className={cn(!!Icon && 'relative')}>
          <Input
            {...field}
            {...inputProps}
            value={field.value ?? ""}
            className={cn(!!Icon && 'pl-8')}
          />
          {
            Icon && (
              <span className='absolute top-1/2 left-4.5 -translate-y-1/2 -translate-x-1/2'>
                {Icon}
              </span>
            )
          }
        </div>

      </FormControl>
      <FormMessage />
    </FormItem>
  )
}



// select input 

export type SelectInputItem = {
  label: string;
  value: string;
  badgeProp?: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };
  badgeLabel?: string
}

type SelectInputProp<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  label: string;
  placeholder: string;
  items: SelectInputItem[];
  field: ControllerRenderProps<TFieldValues, TName>;
  Icon?: JSX.Element;
} & React.ComponentProps<typeof SelectPrimitive.Root>

export const SelectInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({ label, placeholder, field, items, Icon, ...selectInputProp }: SelectInputProp<TFieldValues, TName>) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl className="w-full">
        <Select
          {...field}
          {...selectInputProp}
        >
          <div className={cn(!!Icon && 'relative')}>
            <SelectTrigger className={cn("w-full", !!Icon && 'pl-8')}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={cn("w-full")}>
              {
                items.map(item => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className={cn("flex items-center relative", item.badgeLabel && 'gap-1.5')}>
                    <span>
                      {item.label}
                    </span>
                    {
                      item.badgeLabel && (
                        <Badge
                          {...item.badgeProp}
                        >
                          {item.badgeLabel}
                        </Badge>
                      )
                    }
                  </SelectItem>
                ))
              }
            </SelectContent>
            {
              Icon && (
                <span className='absolute top-1/2 left-4.5 -translate-y-1/2 -translate-x-1/2'>
                  {Icon}
                </span>
              )
            }
          </div>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}


"use client"

import { VariantProps } from "class-variance-authority"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormDescription,
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
import { JSX } from "react"
import { Switch } from "./ui/switch"
import { LucideProps } from "lucide-react"

type InputFieldProp<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  label: string;
  Icon?: JSX.Element;
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
  isActive?: boolean;
  badgeProp?: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };
  Icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
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
>({ label, placeholder, field, items, Icon: LabelIcon, ...selectInputProp }: SelectInputProp<TFieldValues, TName>) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl className="w-full">
        <Select
          {...selectInputProp}
          // value={field.value}
          // onValueChange={field.onChange}
          // defaultValue={field.value}
          {...field}
        >
          <div className={cn(!!LabelIcon && 'relative')}>
            <SelectTrigger className={cn("w-full", !!LabelIcon && 'pl-8')}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={cn("w-full")}>
              {
                items.map(({ value, label, Icon: ItemIcon, badgeLabel, badgeProp, isActive }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    disabled={isActive}
                    className={cn("flex items-center relative", badgeLabel && 'gap-1.5')}>
                    <span>
                      {label}
                    </span>
                    {
                      ItemIcon && <ItemIcon />
                    }
                    {
                      badgeLabel && (
                        <Badge
                          {...badgeProp}
                        >
                          {badgeLabel}
                        </Badge>
                      )
                    }
                  </SelectItem>
                ))
              }
            </SelectContent>
            {
              LabelIcon && (
                <span className='absolute top-1/2 left-4.5 -translate-y-1/2 -translate-x-1/2'>
                  {LabelIcon}
                </span>
              )
            }
          </div>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem >
  )
}







type SwitchInputProp<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  label: string;
  description: string;
  disabled?: boolean;
  field: ControllerRenderProps<TFieldValues, TName>;
  onChange?: (value: boolean) => void
}


export const SwitchInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({ onChange, label, disabled, description, field }: SwitchInputProp<TFieldValues, TName>) => {
  return (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <FormLabel>{label}</FormLabel>
        <FormDescription>{description}</FormDescription>
      </div>
      <FormControl>
        <Switch
          checked={field.value}
          disabled={disabled}
          onCheckedChange={(value) => {
            field.onChange(value)
            if (!!onChange) {
              onChange(value)
            }
          }
          }
        />
      </FormControl>
    </FormItem>
  )
}
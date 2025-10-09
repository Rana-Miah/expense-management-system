"use client"

import { VariantProps } from "class-variance-authority"
import * as SelectPrimitive from "@radix-ui/react-select"
import * as SwitchPrimitive from "@radix-ui/react-switch"

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
import { Textarea } from "./ui/textarea"



//! Input 
type InputFieldProp = {
  label: string;
  Icon?: JSX.Element;
} & React.ComponentProps<"input">


export function InputField({
  label,
  Icon,
  ...inputProps
}: InputFieldProp) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className={cn(!!Icon && 'relative')}>
          <Input
            {...inputProps}
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

//! Text Area 
type TextAreaFieldProps = {
  label: string;
} & React.ComponentProps<"textarea">


export function TextAreaField({
  label,
  ...inputProps
}: TextAreaFieldProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Textarea
          {...inputProps}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}



// !select input 

type WithBadge = {
  badgeProp: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };
  badgeLabel: string
}
type WithoutBadge = {
  badgeProp?: never
  badgeLabel?: never
}

export type SelectInputItem = {
  label: string;
  value: string;
  Icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
} & (WithBadge | WithoutBadge) & React.ComponentProps<typeof SelectPrimitive.Item>

type SelectInputProp = {
  label: string;
  placeholder: string;
  items: SelectInputItem[];
  Icon?: JSX.Element;
} & React.ComponentProps<typeof SelectPrimitive.Root>

export const SelectInput = ({ label, placeholder, items, Icon: LabelIcon, ...selectInputProp }: SelectInputProp) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl className="w-full">
        <Select
          {...selectInputProp}
        >
          <div className={cn(!!LabelIcon && 'relative')}>
            <SelectTrigger className={cn("w-full", !!LabelIcon && 'pl-8')}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={cn("w-full")}>
              {
                items.map(({ value, label, Icon: ItemIcon, badgeLabel, badgeProp, ...selectItemProps }) => (
                  <SelectItem
                    key={value}
                    {...selectItemProps}
                    value={value}
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




//! Switch input
type SwitchInputProp = {
  label: string;
  description: string;
} & React.ComponentProps<typeof SwitchPrimitive.Root>


export const SwitchInput = ({ label, description, ...props }: SwitchInputProp) => {
  return (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <FormLabel>{label}</FormLabel>
        <FormDescription>{description}</FormDescription>
      </div>
      <FormControl>
        <Switch {...props} />
      </FormControl>
    </FormItem>
  )
}
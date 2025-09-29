'use client'
import { Dispatch, ForwardRefExoticComponent, ReactNode, RefAttributes, SetStateAction, useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { LucideProps, MoreHorizontal, } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from '@/lib/utils'

type DropdownItem = {
    label: string
    onClick?: () => void
    Icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
    disabled?: boolean
    inset?: boolean
    variant?: "default" | "destructive"
    separator?: boolean
} & React.ComponentProps<typeof DropdownMenuPrimitive.Item>

type BaseDropDownProps = {
    items: DropdownItem[];
    menuLabel?: string | ReactNode
} & React.ComponentProps<typeof DropdownMenuPrimitive.Content>



type WithTrigger = BaseDropDownProps & {
    trigger: (callbackFn: Dispatch<SetStateAction<boolean>>) => ReactNode;
    onTrigger?: never
}

type WithoutTrigger = BaseDropDownProps & {
    trigger?: never;
    onTrigger: (callbackFn: Dispatch<SetStateAction<boolean>>) => void
}

type ReusableDropdownProps = WithTrigger | WithoutTrigger

export function ReusableDropdown({
    items,
    trigger,
    onTrigger,
    menuLabel,
    ...contextProps
}: ReusableDropdownProps) {

    const [open, setOpen] = useState(false)

    return (
        <DropdownMenu
            open={open}
            onOpenChange={setOpen}
        >
            <DropdownMenuTrigger asChild>
                {trigger ? trigger(setOpen) : (
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => onTrigger(setOpen)}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                )}
            </DropdownMenuTrigger >
            <DropdownMenuContent {...contextProps}>
                <DropdownMenuLabel>{menuLabel ?? "Actions"}</DropdownMenuLabel>
                {items.map(({ label, Icon, ...itemProp }, idx) => (
                    <div key={idx}>
                        {itemProp.separator && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                            {...itemProp}
                            onClick={() => {
                                setOpen(false)
                                if (itemProp.onClick) itemProp.onClick()
                            }}
                            className={cn('flex items-center', Icon && 'justify-between', itemProp.className)}
                        >
                            <span>{label}</span>
                            {Icon && <Icon />}
                        </DropdownMenuItem>
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Trash, PlusCircle } from "lucide-react"
import { FieldArrayPath, FieldValues, UseFieldArrayReturn } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { AlertModal } from "./alert-modal"
import { useAlertModal, useAlertModalClose, useAlertModalOpen } from "@/hooks/redux"
import { CardWrapper } from "./card-wrapper"
import { generateToasterDescription } from "@/lib/helpers"
import { toast } from "sonner"

type DynamicFormSheetProps<
    TFieldValues extends FieldValues,
    TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
    fieldArrayValue: UseFieldArrayReturn<TFieldValues, TFieldArrayName, 'id'>
    onOpenChange: Dispatch<SetStateAction<boolean>>
    open: boolean;
    appendHandler: () => void
    title?: string
    description?: string
    renderItem: (index: number) => React.ReactNode
}

export function DynamicFormSheet<
    TFieldValues extends FieldValues,
    TFieldArrayName extends FieldArrayPath<TFieldValues>
>({
    fieldArrayValue,
    appendHandler,
    onOpenChange,
    open,
    title = "Dynamic Items Entry",
    description = "Manage your items here.",
    renderItem,
}: DynamicFormSheetProps<TFieldValues, TFieldArrayName>) {
    const { isAlertOpen, payload } = useAlertModal<number>()
    const onOpen = useAlertModalOpen<number>()
    const onClose = useAlertModalClose()
    const { fields, remove, } = fieldArrayValue



    return (
        <>
            <AlertModal
                open={isAlertOpen}
                title="Are you sure?"
                description={`Purchase item #${payload!==null ? payload + 1 : ""} will deleted`}
                onCancel={onClose}
                onConfirm={() => {
                    const description = generateToasterDescription()

                    if (payload === null) {
                        toast.error('Missing alert payload for delete item!', { description })
                        return
                    }
                    remove(payload)
                    onClose()
                    toast.success(`Item #${payload + 1} deleted`, { description })
                    if (fields.length === 1) {
                        onOpenChange(false)
                    }
                }}
            />
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="gap-0">
                    <SheetHeader className="sticky top-0 left-0 right-0 bg-background rounded-b-md py-5 px-4 w-full z-40 border-b-2">
                        <SheetTitle>{title}</SheetTitle>
                        <SheetDescription>{description}</SheetDescription>
                    </SheetHeader>

                    <div className="max-h-screen overflow-y-auto px-4 mt-4">
                        <div className="space-y-4 mb-4">
                            {fields.map((_, index) => (

                                <CardWrapper
                                    title={`Item #${index + 1}`}
                                    description='Purchase Item'
                                    headerElement={
                                        <Button
                                            type='button'
                                            variant='destructive'
                                            onClick={() => {
                                                // console.log(_.id)
                                                onOpen(index)
                                            }}
                                        >
                                            <Trash />
                                        </Button>
                                    }
                                    key={_.id}
                                >
                                    {renderItem(index)}
                                </CardWrapper>
                            ))}
                        </div>
                    </div>

                    <div className="sticky bottom-0 left-0 right-0 bg-background rounded-t-md py-5 px-4 w-full z-40 border-t-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full flex items-center gap-1.5"
                            onClick={appendHandler}
                        >
                            <PlusCircle className="h-4 w-4" />
                            <span>Add Item</span>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}

'use client'

import { PlusCircle } from "lucide-react"
import { Button } from "./ui/button"
import { useAppDispatch } from "@/hooks/redux";
import { onOpen } from "@/lib/redux/slice/modal-slice";
import { ModalType } from "@/interface/modal-slice";

type ModalTriggerButtonProps = {
    label: string;
    modalType: ModalType
}

export const ModalTriggerButton = ({ label, modalType }: ModalTriggerButtonProps) => {

    const dispatch = useAppDispatch()
    const onOpenHandler = () => dispatch(onOpen(modalType))

    return (
        <Button
            onClick={onOpenHandler}
        >
            <PlusCircle />
            <span>
                New {label}
            </span>
        </Button>
    )
}

import { ModalType } from "@/interface/modal-slice";
import { useAppDispatch, useAppSelector } from ".";
import { onClose, onOpen } from "@/lib/redux/slice/modal-slice";

export const useModal = ()=>useAppSelector(state=>state.modal)
export const useAlertModal = ()=>useAppSelector(state=>state.alertModal)

export const useModalOpen = ()=>{
    const dispatch = useAppDispatch()
    const onOpenHandler = (type:ModalType)=>dispatch(onOpen(type))
    return onOpenHandler
}

export const useModalClose = ()=>{
    const dispatch = useAppDispatch()
    const onCloseHandler = ()=>dispatch(onClose())
    return onCloseHandler
}
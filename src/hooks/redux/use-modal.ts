import { ModalType } from "@/interface/modal-slice";
import { useAppDispatch, useAppSelector } from ".";
import { onClose, onOpen } from "@/lib/redux/slice/modal-slice";
import { AlertModalInitialState, onAlertClose, onAlertOpen } from "@/lib/redux/slice/alert-modal-slice";

export const useModal = () => useAppSelector(state => state.modal)
export const useAlertModal = <T = unknown>() => useAppSelector(state => state.alertModal as AlertModalInitialState<T>)

export const useModalOpen = () => {
    const dispatch = useAppDispatch()
    const onOpenHandler = (type: ModalType) => dispatch(onOpen(type))
    return onOpenHandler
}

export const useModalClose = () => {
    const dispatch = useAppDispatch()
    const onCloseHandler = () => dispatch(onClose())
    return onCloseHandler
}

export const useAlertModalOpen = <T>() => {
    const dispatch = useAppDispatch()
    const onOpenHandler = (payload: T) => dispatch(onAlertOpen(payload))
    return onOpenHandler
}

export const useAlertModalClose = () => {
    const dispatch = useAppDispatch()
    const onCloseHandler = () => dispatch(onAlertClose())
    return onCloseHandler
}
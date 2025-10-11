import { MODAL_TYPE ,RESTORE_MODAL_TYPE} from "@/constant";

export type ModalType = keyof typeof MODAL_TYPE
export type RestoreModalType = keyof typeof RESTORE_MODAL_TYPE

export type RestoreAlertModalPayload = {
    id: string,
    label: string
    modalType:RestoreModalType
}
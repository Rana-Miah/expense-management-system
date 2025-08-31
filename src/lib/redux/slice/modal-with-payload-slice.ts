import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ModalType } from "@/interface/modal-slice";


export type PayloadType = {
    type: ModalType | null;
    data: unknown
}

export type ModalInitialState = {
    payload: PayloadType
    isOpen: boolean
}

const initialState: ModalInitialState = {
    payload: {
        type: null,
        data: null
    },
    isOpen: false
}

export const modalSlice = createSlice({
    name: 'modal-slice',
    initialState,
    reducers: {
        onOpen: (state, action: PayloadAction<PayloadType>) => {
            state.payload = action.payload
            state.isOpen = true
        },
        onClose: (state) => {
            state.payload.type = null
            state.payload.data = null
            state.isOpen = false
        },
    }
})
const modalReduce = modalSlice.reducer

export const { onClose, onOpen } = modalSlice.actions

export default modalReduce

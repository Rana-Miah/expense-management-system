import { configureStore } from '@reduxjs/toolkit'
import modalReduce from './slice/modal-slice'
import alertModalReduce from './slice/alert-modal-slice'
import { baseApi } from './base-api'

export const createStore = () => configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        modal: modalReduce,
        alertModal: alertModalReduce
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware)
})
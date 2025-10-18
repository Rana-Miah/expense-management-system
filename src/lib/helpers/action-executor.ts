import { ActionFailureWithError, ActionFailureWithoutError, ActionSuccess } from '@/interface'
import { toast } from 'sonner'
import { generateToasterDescription } from './toaster-description'

type ActionExecutorParam<T> = Promise<ActionFailureWithoutError | ActionFailureWithError<unknown> | ActionSuccess<T>>

export const actionExecutor = async <T,>(promise: ActionExecutorParam<T>, callbackFn?: (data: T) => void) => {
    const description = generateToasterDescription()
    const res = await promise
    if (!res.success) {
      toast.error(res.message,{description})
      if (res.isError) console.log({ errorResponse: res.error })
      return
    }

    toast.success(res.message,{description})
    if(callbackFn){
      callbackFn(res.data)
    }
    return
  }
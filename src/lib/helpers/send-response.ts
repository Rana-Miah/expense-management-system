import { ActionFailure, ActionFailureWithoutError, ActionSuccess } from "@/interface"

export function successResponse<T>(message: string, data: T): ActionSuccess<T> {
  return {
    success: true,
    message,
    data,
  }
}

export function failureResponse<E>(
  message: string, error?: E
): ActionFailure<E> {
  const errorMessage = error instanceof Error ? error.message : 'Something went wrong!'
  const errorName = error instanceof Error ? error.name : 'Unknown error'


  const withoutError: ActionFailureWithoutError = {
    success: false,
    isError: false,
    message,
    errorMessage: 'Something went wrong!',
  }

  return !error ? withoutError : {
    success: false,
    isError: true,
    message,
    errorMessage: `${errorName} : ${errorMessage}`,
    error
  }
}
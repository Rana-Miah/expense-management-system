import { SendFailureResponse, SendResponse, SendSuccessResponse } from "@/interface"

export function successResponse<T>(message: string, data: T): SendSuccessResponse<T> {
  return {
    success: true,
    message,
    data,
    error: null
  }
}

export function failureResponse<E extends Error>(
  message: string,
  error: E | unknown | null = null
): SendFailureResponse<E> {
  return {
    success: false,
    message,
    data: null,
    error
  }
}
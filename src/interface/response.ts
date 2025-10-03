export type ActionSuccess<T> = {
    success: true;
    message: string
    data: T;
}

export type ActionFailureWithError<FR> = {
    success: false;
    isError: true;
    message: string
    errorMessage: string;
    error: FR;
}
export type ActionFailureWithoutError = {
    success: false;
    isError: false;
    message: string
    errorMessage: string;
}



export type ActionFailure<FR = Error> = ActionFailureWithError<FR> | ActionFailureWithoutError

export type SendResponse<SR, FR = Error> = ActionSuccess<SR> | ActionFailure<FR>

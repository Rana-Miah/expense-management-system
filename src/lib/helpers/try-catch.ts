type TryCatchSuccess<T> = readonly [T, null]
type TryCatchError<E = Error> = readonly [null, E]

type Result<T, E = Error> = Promise<TryCatchSuccess<T> | TryCatchError<E>>

export const tryCatch = async <T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> => {
    try {
        const data = await promise
        return [data, null] as const
    } catch (error) {
        console.log({
            errorName: (error as Error)?.name || 'unknown error',
            errorMessage: (error as Error)?.message || 'unknown error',
            error, from: "tryCatch utils "
        })
        return [null, error as E] as const
    }
}

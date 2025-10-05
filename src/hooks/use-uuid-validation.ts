import { useRouter } from "next/navigation"
import z from "zod"

export const useUuidValidation = (value: unknown, redirectUrl: string) => {
    const validation = z.uuid().safeParse(value)
    if (!validation.success) {
        return
    }

    return validation.data
}
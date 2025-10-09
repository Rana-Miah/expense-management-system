
import { redirect } from 'next/navigation'
import z from 'zod'

const uuidSchema = z.uuid({ message: 'Invalid id!' })

export const uuidValidator = (input: unknown, redirectUrl: string) => {
    const validation = uuidSchema.safeParse(input)
    if (!validation.success) redirect(redirectUrl)
    return validation.data
}
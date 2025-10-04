import { getBanksByClerkUserId } from "@/services/bank"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
const StartUpLayout = async ({ children }: { children: ReactNode }) => {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    const banks = await getBanksByClerkUserId(userId)

    const totalBank = banks.length

    if (totalBank === 1) {
        redirect(`/accounts/${banks[0].id}`)
    }
    if (totalBank > 1) {
        redirect(`/accounts`)
    }

    return (
        <>
            {children}
        </>
    )
}

export default StartUpLayout


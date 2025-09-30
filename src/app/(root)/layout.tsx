import { getBankByClerkUserId } from "@/services/bank"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
const StartUpLayout = async ({ children }: { children: ReactNode }) => {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    const bank = await getBankByClerkUserId(userId)

    if (bank) {
        redirect(`/accounts/${bank.id}`)
    }

    return (
        <>
            {children}
        </>
    )
}

export default StartUpLayout


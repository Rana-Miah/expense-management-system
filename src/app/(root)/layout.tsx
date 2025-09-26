import { getBanksByClerkUserId } from "@/services/bank/GET"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
const StartUpLayout = async ({ children }: { children: ReactNode }) => {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    const existBanks = await getBanksByClerkUserId(userId)
    const totalBanks = existBanks.length

    if (totalBanks > 0) {
        totalBanks < 2
            ? redirect(`/accounts/${existBanks[0].id}`)
            :redirect(`/accounts`)
    }


    return (
        <>
            {children}
        </>
    )
}

export default StartUpLayout


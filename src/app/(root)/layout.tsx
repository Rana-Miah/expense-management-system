import { dummyBanks } from "@/constant/dummy-db/bank"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
const StartUpLayout = ({ children }: { children: ReactNode }) => {

    // if (dummyBanks.length > 0) redirect(`/${dummyBanks[0].id}`)


    return (
        <>
            {children}
        </>
    )
}

export default StartUpLayout


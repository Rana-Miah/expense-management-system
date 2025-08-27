import { dummyBanks, findBankById } from "@/constant/dummy-db/bank-account"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
const StartUpLayout = ({ children }: { children: ReactNode }) => {

    const existBank = {id:false} // findBankById("b2c3d4e5-f6a7-8901-2345-67890abcdef1")

    if (existBank.id) redirect(`/${existBank?.id}`)


    return (
        <>
            {children}
        </>
    )
}

export default StartUpLayout


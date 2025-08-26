import { CardStack } from "@/components/ui/card-stack"
import { dummyBanks, findBanksByClerkUserId } from "@/constant/dummy-db/bank-account"
import { redirect } from "next/navigation"

const AccountsPage = () => {
    const banks = findBanksByClerkUserId(dummyBanks[1].clerkUserId)
    if (banks.length < 1) redirect('/')
    return(
        <div className="flex items-center justify-center h-screen">
          <CardStack
          
          items={banks.map(item=>({
            ...item,
            content:<>hello content</>
          }))}
          />
        </div>
    )
}
export default AccountsPage
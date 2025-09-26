import { CardStack } from "@/components/ui/card-stack"
import { getBanksByClerkUserId } from "@/services/bank/GET"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const AccountsPage = async () => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  const banks = await getBanksByClerkUserId(userId)
  if (banks.length < 1) redirect('/')
  return (
    <div className="flex items-center justify-center h-screen">
      <CardStack

        items={banks.map(item => ({
          ...item,
          content: <>hello content</>
        }))}
      />
    </div>
  )
}
export default AccountsPage
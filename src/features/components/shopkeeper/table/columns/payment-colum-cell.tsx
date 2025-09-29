'use client'

import { Bank, dummyBanks } from "@/constant/dummy-db/bank-account";
import { useAppDispatch } from "@/hooks/redux";
import { MODAL_TYPE } from "@/constant";
import { onOpen } from "@/lib/redux/slice/modal-slice";
import { ShopkeeperBillPaymentModal } from "@/components/modals/shopkeeper-bill-payment-modal"
import { Button } from "@/components/ui/button"
import { HandCoins } from "lucide-react"
import { ShopkeeperColumnCellContext } from "."

export const ShopkeeperPaymentColumnCell = ({ row: { original: { id, totalDue, isBan } } }: ShopkeeperColumnCellContext) => {
    const hasTotalDue = totalDue >= 1
            const banButHasTotalDue = hasTotalDue && isBan
            const notBanAlsoHasTotalDue = hasTotalDue && !isBan

            const condition = banButHasTotalDue || notBanAlsoHasTotalDue

            return (
                <>
                    {
                        condition && (
                            <PaymentButton
                                banks={dummyBanks}
                                shopkeeperId={id}
                            />
                        )
                    }
                </>
            )
}


const PaymentButton = ({ banks, shopkeeperId }: { banks: Bank[], shopkeeperId: string }) => {
    const dispatch = useAppDispatch()
    const onClickHandler = () => dispatch(onOpen(MODAL_TYPE.SHOPKEEPER_PAYMENT))

    return (
        <>

            <Button
                onClick={onClickHandler}
                className="flex items-center gap-1.5"
                size={'sm'}
            >
                <HandCoins />
                <span>Pay</span>

            </Button>

            <ShopkeeperBillPaymentModal
                banks={banks}
                shopkeeperId={shopkeeperId}
            />
        </>
    )
}
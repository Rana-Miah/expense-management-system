'use client'

import { Bank } from "@/constant/dummy-db/bank-account";
import { useAppDispatch } from "@/hooks/redux";
import { MODAL_TYPE } from "@/constant";
import { onOpen } from "@/lib/redux/slice/modal-slice";
import { ShopkeeperBillPaymentModal } from "@/components/modals/shopkeeper-bill-payment-modal"
import { Button } from "@/components/ui/button"
import { HandCoins, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { ShopkeeperColumnCellContext } from ".";

export const ShopkeeperPurchaseColumnCell = ({ row: { original: { id, totalDue, isBan } } }: ShopkeeperColumnCellContext) => {
    return (
        <>{
            !isBan && (
                <Link
                    href={`/shopkeepers/${id}/purchase-item`}
                >
                    <Button
                        variant={'outline'}
                        className="flex items-center gap-1.5"
                    >
                        <ShoppingCart />
                        <span>Purchase Item</span>
                    </Button>
                </Link>
            )
        }</>
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
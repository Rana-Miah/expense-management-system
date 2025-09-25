import { dummyShopkeeperPayments } from "@/constant/dummy-db/shopkeeper-payment"
import { ShopkeeperPaymentsTable } from "@/features/components/shopkeeper/payments/table"

const ShopkeeperPaymentsPage = ()=>{
    return (
        <ShopkeeperPaymentsTable
        payments={dummyShopkeeperPayments}
        />
    )
}

export default ShopkeeperPaymentsPage
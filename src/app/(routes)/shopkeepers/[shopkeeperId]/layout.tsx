import { LayoutNav } from "@/components/layout-nav";
import { Edit, Info } from "lucide-react";
import { ReactNode } from "react";

const ShopkeeperDetailsLayoutPage = async({ children ,params}: { children: ReactNode; params: Promise<{ shopkeeperId :string}> }) => {
    const param = await params

    return (
        <>
            <LayoutNav
                links={[
                    {
                        href: `/shopkeepers/${param.shopkeeperId}/edit`,
                        label:'Edit',
                        Icon:<Edit/>
                    },
                    {
                        href: `/shopkeepers/${param.shopkeeperId}`,
                        label:'Details',
                        Icon:<Info/>
                    }
                ]}
            />
            {children}
        </>
    )
}

export default ShopkeeperDetailsLayoutPage
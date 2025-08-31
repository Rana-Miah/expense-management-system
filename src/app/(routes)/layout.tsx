import { MobileNavbar } from "@/components/navbar"
import { ReactNode } from "react"
const StartUpLayout = ({ children }: { children: ReactNode }) => {
return (
        <>
            <MobileNavbar/>
            <div className="pt-20">
                {children}
            </div>
        </>
    )
}

export default StartUpLayout


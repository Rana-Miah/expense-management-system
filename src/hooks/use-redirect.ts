'use client'
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export const useRedirect = (condition: boolean, redirectTo: string, callbackFn?: () => void) => {
    const router = useRouter()
    const pathName = usePathname()
    useEffect(() => {
        if (condition) {
            router.push(redirectTo)
        }
        if (callbackFn) {
            callbackFn()
        }
    }, [condition, router,callbackFn])
}
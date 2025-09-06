'use client'

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCoolDown } from "@/hooks"
import { useEffect, useState } from "react"

type DescriptionFormatterProps = {
    maxLength: number
    description: string | undefined
}

export function DescriptionFormatter({ maxLength, description }: DescriptionFormatterProps) {
    const [open, setOpen] = useState(false)
    const { coolDown,setCoolDown } = useCoolDown()

    const length = description?.length ?? 0
    const modifiedDescription = length > maxLength && description
        ?
        description.slice(0, maxLength)
        : description


        console.log({
            coolDown
        })

    useEffect(() => {
        if (coolDown <= 0) {
            setOpen(false)
        }
    }, [coolDown, setOpen])

    return (
        <Tooltip
            open={open}
        >
            <TooltipTrigger asChild>
                <Button variant="outline"
                    onClick={() => {
                        setOpen(pre => !pre)
                        setCoolDown(5)
                    }}
                >{modifiedDescription}...See more</Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{description}</p>
            </TooltipContent>
        </Tooltip>
    )
}

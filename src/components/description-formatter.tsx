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
    const { coolDown, setCoolDown } = useCoolDown()

    const length = description?.length ?? 0
    const modifiedDescription = length > maxLength && description
        ? description.slice(0, maxLength)
        : description

    const duration = Math.round(length * .035)

    useEffect(
        () => {
            if (coolDown <= 0) {
                setOpen(false)
            }
        },
        [coolDown, setOpen]
    )


    return (
        <Tooltip
            open={open}
        >
            <TooltipTrigger
                onClick={() => {
                    setOpen(pre => !pre)
                    setCoolDown(
                        duration < 3
                            ? 5
                            : duration > 15
                                ? 15
                                : duration
                    )
                }}
            >
                {modifiedDescription}...<span
                    className="font-semibold"
                >See more</span>
            </TooltipTrigger>
            <TooltipContent
                className="max-w-3xs"
            >
                <p className="text-wrap">{description}</p>
            </TooltipContent>
        </Tooltip>
    )
}

'use client'
import { ReactNode, JSX, } from 'react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
export type LayoutLinkType = {
    label: string;
    href: string;
    Icon?: JSX.Element | ReactNode
}

type LayoutNavProps = {
    links: LayoutLinkType[]
}

export const LayoutNav = ({ links }: LayoutNavProps) => {
    const pathname = usePathname()

    return (
        <nav
            className='flex items-center space-x-4 overflow-x-auto py-4 border mb-4 px-4 rounded-xl'
        >
            {
                links.map(({ label, href, Icon }, i) => {
                    const isActive = pathname.endsWith(href)
                    return (

                        <Link
                            key={`${label}-${i}`}
                            href={href}
                            className={cn('flex items-center space-x-1 flex-nowrap text-nowrap')}
                        >
                            <Badge
                                variant={isActive ? 'default' : 'outline'}
                                className='flex items-center gap-1.5 py-1 rounded-sm'
                            >
                                {Icon && Icon}
                                <span>
                                    {label}
                                </span>
                            </Badge>
                        </Link>
                    )
                })
            }
        </nav>
    )
}

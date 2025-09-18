'use client'
import { ReactNode, JSX, } from 'react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CardDescription, CardTitle } from './ui/card'
export type LayoutLinkType = {
    label: string;
    href: string;
    Icon?: JSX.Element | ReactNode
}

type LayoutNavProps = {
    links: LayoutLinkType[]
    header?: {
        title: string;
        description: string
    }
}

export const LayoutNav = ({ links, header }: LayoutNavProps) => {
    const pathname = usePathname()

    return (
        <div className ="flex flex-col space-y-2.5 border rounded-xl pt-4 px-4 mb-4 z-30">
            {
                header && (
                    <>
                        <CardTitle>
                            {header.title}
                        </CardTitle>
                        <CardDescription>
                            {header.description}
                        </CardDescription>
                    </>
                )
            }
            <nav
                className='flex items-center space-x-2 overflow-x-auto pb-4'
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
        </div>
    )
}

'use client'
import { Button } from './ui/button'
import { PaginationMeta } from '@/interface'
import { useQueryString } from "@/hooks/use-query-string"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectValue, SelectGroup } from './ui/select'
import { MoreHorizontal } from 'lucide-react'

type DataTablePaginationProp = {
    pagination: PaginationMeta,
    enableSmartPagination?: boolean
}

export const DataTablePagination = ({ pagination, enableSmartPagination }: DataTablePaginationProp) => {
    const { setPagination } = useQueryString()
    const { currentPage, totalPages, limit, hasNextPage, hasPrevPage, nextPage, prevPage } = pagination



    // Always show first two and last two pages
    const totalNumberOfPages = Array.from({ length: totalPages > 0 ? totalPages : 1 }, (_, i) => ++i)
    const firstTwo = totalNumberOfPages.slice(0, 1)
    const lastTwo = totalNumberOfPages.slice(-1)

    // Sliding window around current page (5 pages window)
    const start = Math.max(currentPage - 2, 2) // start after first two
    const end = Math.min(currentPage + 2, totalPages - 1) // end before last two

    const middlePages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

    const showLeftDots = start > 3
    const showRightDots = end < totalPages - 2



    console.dir({
        ...pagination,
    }, {
        depth: null
    })



    return (
        <>
            {
                totalPages > 1 && (
                    <div className='space-y-4 mt-4'>
                        <div>
                            {
                                enableSmartPagination && (
                                    <>
                                        {
                                            totalNumberOfPages.length > 8 ? (
                                                <div className="flex flex-wrap items-center justify-center gap-1.5 w-full">
                                                    {
                                                        firstTwo.map(fpn => (
                                                            <Button
                                                                key={fpn}
                                                                onClick={() => setPagination('page', fpn.toString())}
                                                                size={'sm'}
                                                                variant={currentPage === fpn ? 'default' : 'secondary'}
                                                            >
                                                                {fpn}
                                                            </Button>
                                                        ))
                                                    }
                                                    {/* Left dots */}
                                                    {showLeftDots && (
                                                        <MoreHorizontal size={14} />
                                                    )}

                                                    {/* Middle pages */}
                                                    {middlePages.map((page) => (
                                                        <Button
                                                            key={page}
                                                            onClick={() => setPagination('page', page.toString())}
                                                            size="sm"
                                                            variant={currentPage === page ? "default" : "secondary"}
                                                        >
                                                            {page}
                                                        </Button>
                                                    ))}

                                                    {/* Right dots */}
                                                    {showRightDots && (
                                                        <MoreHorizontal size={14} />
                                                    )}

                                                    {
                                                        lastTwo.map(lpn => (
                                                            <Button
                                                                key={lpn}
                                                                onClick={() => setPagination('page', lpn.toString())}
                                                                size={'sm'}
                                                                variant={currentPage === lpn ? 'default' : 'secondary'}
                                                            >
                                                                {lpn}
                                                            </Button>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap items-center justify-center gap-1.5 w-full">
                                                    {
                                                        totalNumberOfPages.map(tp => (
                                                            <Button
                                                                key={tp}
                                                                onClick={() => setPagination('page', tp.toString())}
                                                                size={'sm'}
                                                                variant={currentPage === tp ? 'default' : 'secondary'}
                                                            >
                                                                {tp}
                                                            </Button>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </>
                                )
                            }
                        </div>

                        <div className="flex items-center justify-between gap-2 space-x-2 w-full">
                            {/* set limit button */}
                            <div className='flex-1 w-full'>
                                <Select
                                    onValueChange={(value) => {
                                        setPagination('limit', value)
                                    }}
                                >
                                    <SelectTrigger className="max-w-[120px]">
                                        <SelectValue placeholder={limit} />
                                    </SelectTrigger>
                                    <SelectContent className="max-w-[120px]">
                                        <SelectGroup>
                                            <SelectLabel>Limit</SelectLabel>
                                            {
                                                ["2", "3", "5", "6", "10", "15", "20"].map(limit => (
                                                    <SelectItem value={limit} key={limit}>{limit}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>

                                    </SelectContent>
                                </Select>
                            </div>

                            {/* next & previous button */}
                            <div className="space-x-2 flex-1 w-full flex flex-nowrap items-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setPagination('page', prevPage.toString())
                                    }}
                                    disabled={!hasPrevPage || !currentPage}
                                >
                                    Previous
                                </Button>


                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setPagination('page', nextPage.toString())
                                    }}
                                    disabled={!hasNextPage}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

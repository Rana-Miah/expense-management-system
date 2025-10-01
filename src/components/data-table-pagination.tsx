'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Pagination } from '@/interface'
import { useQueryString } from "@/hooks/use-query-string"
import { useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectValue, SelectGroup } from './ui/select'
import { ReusableDropdown } from './drop-down'
import { MoreHorizontal } from 'lucide-react'

type DataTablePaginationProp = {
    pagination: Pagination,
    enableSmartPagination?: boolean
}

export const DataTablePagination = ({ pagination, enableSmartPagination }: DataTablePaginationProp) => {
    const [selectedLimit, setSelectedLimit] = useState("2")
    const { setPagination } = useQueryString()
    const searchParam = useSearchParams()
    const pageNumber = searchParam.get('page')
    const pageLimit = searchParam.get('limit')

    const currentPageNumber = pageNumber ? Number(pageNumber) : 1


    const numberOfPage = Math.ceil(pagination.total / pagination.limit)

    // Always show first two and last two pages
    const firstTwo = [1, 2]
    const lastTwo = [numberOfPage - 1, numberOfPage]

    // Sliding window around current page (5 pages window)
    const start = Math.max(currentPageNumber - 2, 3) // start after first two
    const end = Math.min(currentPageNumber + 2, numberOfPage - 2) // end before last two

    const middlePages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

    const showLeftDots = start > 3
    const showRightDots = end < numberOfPage - 2



    return (
        <div className="flex items-center justify-between gap-2 space-x-2 py-4 w-full">

            <div className='flex-1 w-full'>
                <Select
                    onValueChange={(value) => {
                        setPagination('limit', value)
                    }}
                >
                    <SelectTrigger className="max-w-[120px]">
                        <SelectValue placeholder={(pageLimit && pageLimit !== 'Nan') ? pageLimit : "1"} />
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

            <div>
                {
                    enableSmartPagination && (
                        <div className="flex items-center gap-1.5 w-full">
                            {
                                firstTwo.map(fpn => (
                                    <Button
                                        key={fpn}
                                        onClick={() => setPagination('page', fpn.toString())}
                                        size={'sm'}
                                        variant={currentPageNumber === fpn ? 'default' : 'secondary'}
                                    >
                                        {fpn}
                                    </Button>
                                ))
                            }
                            {/* Left dots */}
                            {showLeftDots && (
                                <span className="px-2">
                                    <MoreHorizontal />
                                </span>
                            )}

                            {/* Middle pages */}
                            {middlePages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => setPagination('page', page.toString())}
                                    size="sm"
                                    variant={currentPageNumber === page ? "default" : "secondary"}
                                >
                                    {page}
                                </Button>
                            ))}

                            {/* Right dots */}
                            {showRightDots && (
                                <span className="px-2">
                                    <MoreHorizontal />
                                </span>
                            )}





                            {
                                lastTwo.map(lpn => (
                                    <Button
                                        key={lpn}
                                        onClick={() => setPagination('page', lpn.toString())}
                                        size={'sm'}
                                        variant={currentPageNumber === lpn ? 'default' : 'secondary'}
                                    >
                                        {lpn}
                                    </Button>
                                ))
                            }
                        </div>

                    )
                }

            </div>

            <div className="space-x-2 flex-1 w-full flex flex-nowrap items-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {

                        if (currentPageNumber && currentPageNumber > 0) {
                            setPagination('page', (currentPageNumber - 1).toString())
                            return
                        }

                    }}
                    disabled={currentPageNumber === 1 || !currentPageNumber}
                >
                    Previous
                </Button>


                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {

                        if (currentPageNumber === 0) {
                            setPagination('page', "2")
                            return
                        }

                        if (currentPageNumber && currentPageNumber < numberOfPage) {
                            setPagination('page', (currentPageNumber + 1).toString())
                            return
                        }
                    }}
                    disabled={currentPageNumber === numberOfPage}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

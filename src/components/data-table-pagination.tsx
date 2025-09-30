'use client'
import React from 'react'
import { Button } from './ui/button'
import { Pagination } from '@/interface'
import { useQueryString } from "@/hooks/use-query-string"
import { useSearchParams } from 'next/navigation'

type DataTablePaginationProp = {
    pagination: Pagination
}

export const DataTablePagination = ({ pagination }: DataTablePaginationProp) => {

    const { searchQuery, setPagination } = useQueryString()
    const searchParam = useSearchParams()
    const currentPageNumber = Number(searchParam.get('page'))

    const numberOfPage = Math.ceil(pagination.total / pagination.limit)


    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => {

                    if (currentPageNumber && currentPageNumber > 0) {
                        setPagination('page', (currentPageNumber - 1).toString())
                        return
                    }

                }}
                disabled={currentPageNumber === 1||!currentPageNumber}
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
    )
}

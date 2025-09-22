import React from 'react'
import { Button } from './ui/button'
import { Pagination } from '@/interface'

type DataTablePaginationProp={
    pagination:Pagination
}

export const DataTablePagination = ({pagination}:DataTablePaginationProp) => {
    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => { }}
                disabled={false}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => { }}
                disabled={false}
            >
                Next
            </Button>
        </div>
    )
}

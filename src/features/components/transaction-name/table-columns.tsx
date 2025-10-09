import { Badge } from '@/components/ui/badge'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { TrxNameSelectValue } from '@/drizzle/type'
import { dateFormatter } from '@/lib/helpers'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { Check, X } from 'lucide-react'
import { ActionColumn } from './action-column'

type TrxNameTableColumnDef = ColumnDef<TrxNameSelectValue>
export type TrxNameTableColumnCellContext = CellContext<TrxNameSelectValue, unknown>

const actionColumn: TrxNameTableColumnDef = {
    id: 'Action',
    cell: ActionColumn
}

export const TraxNameTableColumns: TrxNameTableColumnDef[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row: { original: { name, createdAt, isActive } } }) => {

            return (
                <>
                    <CardTitle className='flex items-center gap-1'>
                        <span>
                            {name}
                        </span>
                        <span>
                            <Badge
                                variant={isActive ? "success" : "destructive"}
                                className='rounded-full p-0.5'
                            >
                                {
                                    isActive ? <Check /> : <X />
                                }
                            </Badge>
                        </span>
                    </CardTitle>
                    <CardDescription>{dateFormatter(new Date(createdAt), 'dd MMMM, yyyy')}</CardDescription>
                </>
            )
        }
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Update',
        cell: ({ row: { original: { updatedAt } } }) => {

            return dateFormatter(new Date(updatedAt))
        }
    },
    actionColumn
]
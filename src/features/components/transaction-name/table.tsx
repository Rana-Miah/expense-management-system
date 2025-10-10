'use client'
import { CardWrapper, DataTable } from '@/components'
import { pluralize } from '@/lib/helpers'
import { TrxNameTableColumns } from './table-columns'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAppDispatch } from '@/hooks/redux'
import { MODAL_TYPE } from '@/constant'
import { onOpen } from '@/lib/redux/slice/modal-slice'
import { TrxNameSelectValue } from '@/drizzle/type'


export const TrxNameTable = ({ trxName }: { trxName: TrxNameSelectValue[] }) => {
    const dispatch = useAppDispatch()
    const onClickHandler = () => dispatch(onOpen(MODAL_TYPE.TRX_NAME))
    return (
        <CardWrapper
            title={`${pluralize(trxName.length, 'Transaction')} Name ( ${trxName.length} )`}
            description='Transaction name'
            headerElement={
                <Button
                    className='flex items-center gap-2'
                    onClick={onClickHandler}
                >
                    <span>
                        <Plus />
                    </span>
                    <span>
                        New
                    </span>
                </Button>
            }
        >
            <DataTable
                data={trxName}
                columns={TrxNameTableColumns}
            />
        </CardWrapper>
    )
}
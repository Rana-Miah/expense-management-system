'use client'
import { CardWrapper, DataTable } from '@/components'
import { pluralize } from '@/lib/helpers'
import { TraxNameTableColumns } from './table-columns'
import { TrxName } from '@/constant/dummy-db/trx-name'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAppDispatch, useModal } from '@/hooks/redux'
import { MODAL_TYPE } from '@/constant'
import { onOpen } from '@/lib/redux/slice/modal-slice'


export const TraxNameTable = ({ traxName }: { traxName: TrxName[] }) => {
    const dispatch = useAppDispatch()
    const onClickHandler = () => dispatch(onOpen(MODAL_TYPE.TRX_NAME))
    return (
        <CardWrapper
            title={`${pluralize(traxName.length, 'Transaction', { withCount: true })} Name`}
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
                data={traxName}
                columns={TraxNameTableColumns}
            />
        </CardWrapper>
    )
}
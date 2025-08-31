import { dummyTrxNames } from '@/constant/dummy-db/trx-name'
import { TraxNameTable } from '@/features/components/transaction-name/table'

const TraxName = () => {
    return (
        <TraxNameTable
            traxName={dummyTrxNames}
        />
    )
}

export default TraxName


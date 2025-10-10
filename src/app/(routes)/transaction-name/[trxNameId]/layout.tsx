import { LayoutNav } from '@/components/layout-nav'
import { currentUserId } from '@/lib/current-user-id';
import { uuidValidator } from '@/lib/zod';
import { getTrxNameByIdAndClerkUserId } from '@/services/trx-name';
import { Edit, Info } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

const TrxNameLayout = async({ children,params }:{ children: React.ReactNode; params: Promise<{ trxNameId: string }>}) => {
    const userId = await currentUserId()
    const param = await params
    const trxNameId = uuidValidator(param.trxNameId,`/transaction-name`)
    const currentTrxName = await getTrxNameByIdAndClerkUserId(trxNameId,userId,{columns:{name:true}})
    if(!currentTrxName) redirect('/transaction-name')
    return (
        <>
            <LayoutNav
                    links={[
                        {
                            href:`/transaction-name`,
                            label:'transaction names',
                        },
                        {
                            href:`/transaction-name/${trxNameId}/edit`,
                            label:`Edit (${currentTrxName.name})`,
                            Icon:<Edit/>
                        },
                        {
                           href:`/transaction-name/${trxNameId}`,
                            label:`Details (${currentTrxName.name})`,
                            Icon:<Info/>
                        },
                    ]}
            />
            <section>
                {children}
            </section>
        </>
    )
}

export default TrxNameLayout
import { LayoutNav } from '@/components/layout-nav'
import { uuidValidator } from '@/lib/zod';
import { Edit, Info } from 'lucide-react';
import React from 'react'

const TrxNameLayout = async({ children,params }:{ children: React.ReactNode; params: Promise<{ trxNameId: string }>}) => {
    const param = await params
    const trxNameId = uuidValidator(param.trxNameId,`/transaction-name`)

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
                            label:'Edit',
                            Icon:<Edit/>
                        },
                        {
                           href:`/transaction-name/${trxNameId}`,
                            label:'Details',
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
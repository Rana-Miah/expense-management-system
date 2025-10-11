import { WithParams } from '@/interface/components-common-props'
import { currentUserId } from '@/lib/current-user-id'
import React from 'react'

type UnitPageProp = WithParams<{unitId:string}>

const UnitPage = async({params}:UnitPageProp) => {
    const userId = await currentUserId()

    const param = await params
    

  return (
    <div>{param.unitId}</div>
  )
}

export default UnitPage
'use server'

import { currentUserId } from "@/lib/current-user-id"
import { failureResponse, successResponse } from "@/lib/helpers"
import { getTrxNamesByClerkUserId } from "@/services/trx-name/GET"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
    try {
        const userId = await currentUserId()
        const trnsactionNames = await getTrxNamesByClerkUserId(userId)

        const res = successResponse('Transaction Name retrived successfully', trnsactionNames)
        return NextResponse.json(res)

    } catch (error) {
        console.log(error)
        const res = failureResponse('Failed to retrived data', error)
        return NextResponse.json(res)
    }
}
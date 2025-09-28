import { TrxNameSelectValue } from "@/drizzle/type";
import { SendResponse } from "@/interface";
import { baseApi } from "@/lib/redux/base-api";

type TrxNameApiResponse = SendResponse<TrxNameSelectValue[], unknown>

export const trxNameApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchTrxNames: build.query<TrxNameApiResponse, unknown>({
            query: () => '/trx-name'
        })
    }),
})

export const { useFetchTrxNamesQuery } = trxNameApi
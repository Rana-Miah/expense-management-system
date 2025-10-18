import { PaginationMeta } from "@/interface"

export function getPaginationMeta({
    totalItems,
    currentPage,
    limit,
}: {
    totalItems: number
    currentPage: number
    limit: number
}): PaginationMeta {
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1)
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1
    const offset = (currentPage - 1) * limit

    return {
        totalItems,
        currentPage,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? currentPage + 1 : 1,
        prevPage: hasPrevPage ? currentPage - 1 : totalPages,
        offset,
    }
}

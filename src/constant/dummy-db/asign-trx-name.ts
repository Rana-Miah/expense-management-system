
export const dummyAssignedTrxNames = [
    {
        "id": "1a2b3c4d-e5f6-7890-1234-567890abcdef",
        "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
        "bankAccountId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "trxNameId": "e2f7g9h0-i1j2-k3l4-m5n6-o7p8q9r0s1t2",
        "createdAt": "2025-08-25T10:15:00Z",
        "updatedAt": "2025-08-25T10:15:00Z"
    },
    {
        "id": "2b3c4d5e-f6a7-8901-2345-67890abcdef1",
        "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
        "bankAccountId": "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
        "trxNameId": "g4h9i2j3-k4l5-m6n7-o8p9-q0r1s2t3u4v5",
        "createdAt": "2025-08-25T10:16:00Z",
        "updatedAt": "2025-08-25T10:16:00Z"
    },
    {
        "id": "3c4d5e6f-a7b8-9012-3456-7890abcdef12",
        "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
        "bankAccountId": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
        "trxNameId": "f3g8h1i2-j3k4-l5m6-n7o8-p9q0r1s2t3u4",
        "createdAt": "2025-08-25T10:17:00Z",
        "updatedAt": "2025-08-25T10:17:00Z"
    },
    {
        "id": "4d5e6f7a-b8c9-0123-4567-890abcdef123",
        "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
        "bankAccountId": "e5f6a7b8-c9d0-1234-5678-90abcdef1234",
        "trxNameId": "h5i0j3k4-l5m6-n7o8-p9q0-r1s2t3u4v5w6",
        "createdAt": "2025-08-25T10:18:00Z",
        "updatedAt": "2025-08-25T10:18:00Z"
    },
    {
        "id": "5e6f7a8b-c9d0-1234-5678-90abcdef1234",
        "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
        "bankAccountId": "f6a7b8c9-d0e1-2345-6789-0abcdef12345",
        "trxNameId": "i6j1k4l5-m6n7-o8p9-q0r1-s2t3u4v5w6x7",
        "createdAt": "2025-08-25T10:19:00Z",
        "updatedAt": "2025-08-25T10:19:00Z"
    }
]


export const findAssignedTrxNameByBankIdAndclerkUserId = (bankId: string, clerkUserId: string) => {
    return dummyAssignedTrxNames.find(item => {
        const isBankFound = item.bankAccountId === bankId
        const isClerUserFound = item.clerkUserId === clerkUserId

        if (isBankFound && isClerUserFound) return item
    })
}

export const findAssignedTrxNamesByClerkUserId = (bankId: string, clerkUserId: string) => {
    return dummyAssignedTrxNames.filter(item => item.clerkUserId === clerkUserId)
}

export const findAssignedTrxNamesByBankId = (bankId: string) => {
    return dummyAssignedTrxNames.filter(item => item.bankAccountId === bankId)
}
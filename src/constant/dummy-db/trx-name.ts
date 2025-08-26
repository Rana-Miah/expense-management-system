export const dummyTrxNames = [
  {
    "id": "e2f7g9h0-i1j2-k3l4-m5n6-o7p8q9r0s1t2",
    "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    "name": "Groceries",
    "isActive": true,
    "createdAt": "2025-08-25T10:00:00Z",
    "updatedAt": "2025-08-25T10:00:00Z"
  },
  {
    "id": "f3g8h1i2-j3k4-l5m6-n7o8-p9q0r1s2t3u4",
    "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    "name": "Income",
    "isActive": true,
    "createdAt": "2025-08-25T10:01:00Z",
    "updatedAt": "2025-08-25T10:01:00Z"
  },
  {
    "id": "g4h9i2j3-k4l5-m6n7-o8p9-q0r1s2t3u4v5",
    "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    "name": "Utilities",
    "isActive": true,
    "createdAt": "2025-08-25T10:02:00Z",
    "updatedAt": "2025-08-25T10:02:00Z"
  },
  {
    "id": "h5i0j3k4-l5m6-n7o8-p9q0-r1s2t3u4v5w6",
    "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
    "name": "Dining Out",
    "isActive": true,
    "createdAt": "2025-08-25T10:03:00Z",
    "updatedAt": "2025-08-25T10:03:00Z"
  },
  {
    "id": "i6j1k4l5-m6n7-o8p9-q0r1-s2t3u4v5w6x7",
    "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
    "name": "Expense",
    "isActive": false,
    "createdAt": "2025-08-25T10:04:00Z",
    "updatedAt": "2025-08-25T10:04:00Z"
  },
  {
    "id": "j7k2l5m6-n7o8-p9q0-r1s2-t3u4v5w6x7y8",
    "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
    "name": "Entertainment",
    "isActive": true,
    "createdAt": "2025-08-25T10:05:00Z",
    "updatedAt": "2025-08-25T10:05:00Z"
  },
  {
    "id": "k8l3m6n7-o8p9-q0r1-s2t3-u4v5w6x7y8z9",
    "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    "name": "Withdrawal",
    "isActive": true,
    "createdAt": "2025-08-25T10:06:00Z",
    "updatedAt": "2025-08-25T10:06:00Z"
  },
  {
    "id": "l9m4n7o8-p9q0-r1s2-t3u4-v5w6x7y8z9a0",
    "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
    "name": "Deposit",
    "isActive": true,
    "createdAt": "2025-08-25T10:07:00Z",
    "updatedAt": "2025-08-25T10:07:00Z"
  }
]

export type TrxName = typeof dummyTrxNames[0]

export const findTrxNamesByClerkUserId = (clerkUserId: string) => {
  return dummyTrxNames.filter(item => item.clerkUserId === clerkUserId)
}
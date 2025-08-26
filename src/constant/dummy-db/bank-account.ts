export const dummyBanks = [
  {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    "name": "Personal Checking",
    "balance": 1523.45,
    "lban": "1234567890",
    "isActive": true,
    "createdAt": "2025-08-25T09:00:00Z",
    "updatedAt": "2025-08-25T09:00:00Z"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
    "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    "name": "Savings Account",
    "balance": 54321.99,
    "lban": "0987654321",
    "isActive": false,
    "createdAt": "2025-08-25T09:05:00Z",
    "updatedAt": "2025-08-25T09:05:00Z"
  },
  {
    "id": "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
    "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    "name": "Joint Checking",
    "balance": 789.00,
    "lban": "1122334455",
    "isActive": true,
    "createdAt": "2025-08-25T09:10:00Z",
    "updatedAt": "2025-08-25T09:10:00Z"
  },
  {
    "id": "d4e5f6a7-b8c9-0123-4567-890abcdef123",
    "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    "name": "Vacation Fund",
    "balance": 250.75,
    "lban": "2233445566",
    "isActive": true,
    "createdAt": "2025-08-25T09:15:00Z",
    "updatedAt": "2025-08-25T09:15:00Z"
  },
  {
    "id": "e5f6a7b8-c9d0-1234-5678-90abcdef1234",
    "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
    "name": "Main Checking",
    "balance": 8765.43,
    "lban": "3344556677",
    "isActive": true,
    "createdAt": "2025-08-25T09:20:00Z",
    "updatedAt": "2025-08-25T09:20:00Z"
  },
  {
    "id": "f6a7b8c9-d0e1-2345-6789-0abcdef12345",
    "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
    "name": "Business Account",
    "balance": 12000.50,
    "lban": "4455667788",
    "isActive": true,
    "createdAt": "2025-08-25T09:25:00Z",
    "updatedAt": "2025-08-25T09:25:00Z"
  },
  {
    "id": "a7b8c9d0-e1f2-3456-7890-abcdef123456",
    "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
    "name": "Emergency Fund",
    "balance": 20000.00,
    "lban": "5566778899",
    "isActive": true,
    "createdAt": "2025-08-25T09:30:00Z",
    "updatedAt": "2025-08-25T09:30:00Z"
  },
  {
    "id": "b8c9d0e1-f2a3-4567-890a-bcdef1234567",
    "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
    "name": "Inactive Account",
    "balance": 0.00,
    "lban": "6677889900",
    "isActive": false,
    "createdAt": "2025-08-25T09:35:00Z",
    "updatedAt": "2025-08-25T09:35:00Z"
  }
]

export type Bank = typeof dummyBanks[0]

export const findBankById = (id: string) => {
  return dummyBanks.find(item => item.id === id)
}

export const findBanksByClerkUserId = (clerkUserId: string) => {
  return dummyBanks.filter(item => item.clerkUserId === clerkUserId)
}
export const dummyShopkeepers = [
  {
    "id": "s1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
    "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    "name": "Local Grocery Store",
    "phone": "1234567890",
    "totalDue": 250,
    "isBan": false,
    "reasonOfBan": null,
    "createdAt": "2025-08-25T11:45:00Z",
    "updatedAt": "2025-08-25T11:45:00Z"
  },
  {
    "id": "s2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7",
    "clerkUserId": "user_3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q",
    "name": "Electronics Shop",
    "phone": "0987654321",
    "totalDue": 0,
    "isBan": false,
    "reasonOfBan": null,
    "createdAt": "2025-08-25T11:46:00Z",
    "updatedAt": "2025-08-25T11:46:00Z"
  },
  {
    "id": "s3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8",
    "clerkUserId": "user_2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    "name": "Bad Credit Vendor",
    "phone": "1122334455",
    "totalDue": 1500,
    "isBan": true,
    "reasonOfBan": "Multiple overdue payments",
    "createdAt": "2025-08-25T11:47:00Z",
    "updatedAt": "2025-08-25T11:47:00Z"
  }
]

export type Shopkeeper = typeof dummyShopkeepers[number]
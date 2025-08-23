
export const dummyBanks = [
    {
        id: 'bank-al-rajhi',
        balance: '1000',
        name: 'al rajhi',
        lbn: 'alrajhi-0494'
    },
    {
        id: 'bank-stc-pay',
        balance: '1000',
        name: 'stc-pay',
        lbn: 'stcpay-0494'
    },
    {
        id: 'bank-cash',
        balance: '1000',
        name: 'cash',
        lbn: 'cash-0494'
    },
    {
        id: 'bank-mobily-pay',
        balance: '1000',
        name: 'mobily-pay',
        lbn: 'mobily-0494'
    },
]

export type Bank = typeof dummyBanks[number];
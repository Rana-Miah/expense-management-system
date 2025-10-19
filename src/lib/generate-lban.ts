export const generateLban = (name: string, phone: string) => `${name} - ${phone}`
export const validateLban = (lban: string) => {
    const lbanRegex = /^[A-Za-z]+-01\d{9}$/
    return lbanRegex.test(lban)
}

export const lbanSplitter = (lban: string) => {
    const [bankName, bankNumber] = lban.split('-')
    return { bankName, bankNumber }
}
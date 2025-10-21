

export const capitalize = (str: string, minCharacter: number = 3) => str.length <= minCharacter ? str.toUpperCase() : str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase()

export const makeEachWordCapitalize = (str: string) => {
    const hasSpace = str.includes(" ")
    if (!hasSpace) return capitalize(str)
    const splittedStrings = str.split(" ").map(word => capitalize(word, 1)).join(" ")
    return splittedStrings
}
function pluralize(word: string, isCapitalize?: boolean) {
    if (!word) return "";

    const lower = word.toLowerCase();
    const vowelsRegex = /[aeiou]y$/
    if (lower.endsWith("y") && !vowelsRegex.test(lower)) {
        return isCapitalize ? capitalize(`${word.slice(0, -1)}ies`) : `${word.slice(0, -1)}ies`
    } else if (
        lower.endsWith("s") ||
        lower.endsWith("x") ||
        lower.endsWith("z") ||
        lower.endsWith("ch") ||
        lower.endsWith("sh")
    ) {
        return isCapitalize ? capitalize(`${word}es`) : `${`${word}es`}ies`;
    } else {
        return isCapitalize ? capitalize(`${word}s`) : `${word}s`;
    }
}



export const getMessage = (value: string, isPlural?: boolean) => `${isPlural ? pluralize(capitalize(value)) : capitalize(value)} retrieved!`
export const createMessage = (value: string,) => `${capitalize(value)} created!`
export const updateMessage = (value: string,) => `${capitalize(value)} updated!`
export const deleteMessage = (value: string,) => `${capitalize(value)} deleted!`

export const clerkErrorMessage = (message?: string) => message || `Unable to get clerk user!`
export const failedGetMessage = (value: string, isPlural?: boolean) => `Failed to get ${isPlural ? pluralize(value) : value}!`
export const failedCreateMessage = (value: string, isPlural?: boolean) => `Failed to create ${isPlural ? pluralize(value) : value}!`
export const failedDeletedMessage = (value: string, isPlural?: boolean) => `Failed to delete ${isPlural ? pluralize(value) : value}!`
export const failedUpdateMessage = (value: string,) => `Failed to update ${capitalize(value)}!`

export const invalidFieldsMessage = (message?: string) => message ?? "Invalid fields!"
export const unauthorizedMessage = (message?: string) => message ?? "Unauthorized user!"
export const notFoundMessage = (value: string) => `${capitalize(value)} doesn't exist!`
export const existMessage = (value: string) => `${capitalize(value)} already exist!`
export const newAssignMessage = (trxName: string, bankName: {
    sourceBank?: string;
    receiveBank?: string
}) => {
    if (bankName.sourceBank && bankName.receiveBank) return `Transaction name "${trxName.toUpperCase()}" assigned with "${bankName.sourceBank.toUpperCase()}" as source bank & "${bankName.receiveBank.toUpperCase()}" as receive bank!`
    if (bankName.sourceBank) return `Transaction name "${trxName.toUpperCase()}" assigned with "${bankName.sourceBank.toUpperCase()}" as source bank!`
    if (bankName.receiveBank) return `Transaction name "${trxName.toUpperCase()}" assigned with "${bankName.receiveBank.toUpperCase()}" as receive bank!`
    return ""
}
export const assignedMessage = (trxName: string, bankName: { sourceBank?: string; receiveBank?: string }) => {
    if (bankName.sourceBank && bankName) return `Transaction name "${trxName.toUpperCase()} already assigned with source bank "${bankName.sourceBank}" receive bank "${bankName.receiveBank}"!`
    if (bankName.receiveBank) return `Transaction name "${trxName.toUpperCase()} already assigned with receive bank "${bankName.receiveBank}"!`
    if (bankName.sourceBank) return `Transaction name "${trxName.toUpperCase()} already assigned with source bank "${bankName.sourceBank}"!`
    return ""
}
export const notActiveMessage = (value: string) => `${capitalize(value)} is not active!`
export const missingFieldValue = (field: string) => `${capitalize(field)} is missing!`
export const itemsRequiredMessage = (message?: string) => message || `Did you forget to add items?`
export const insufficientBalance = (message?: string) => message || `Insufficient balance!`
export const deletedRowMessage = (rowName: string) => `${capitalize(rowName)} is deleted! Try to restore!`
export const restoredRowMessage = (rowName: string) => `${capitalize(rowName)} is already restored!`
export const restoreRowMessage = (rowName: string) => `${capitalize(rowName)} is restored!`
export const failedRestoredRowMessage = (rowName: string) => `Failed to restore ${capitalize(rowName)}!`

export const messageUtils = {
    notFoundMessage,
    existMessage,
    newAssignMessage,
    assignedMessage,
    failedGetMessage,
    failedCreateMessage,
    failedDeletedMessage,
    failedUpdateMessage,
    getMessage,
    createMessage,
    updateMessage,
    deleteMessage,
    unauthorizedMessage,
    invalidFieldsMessage,
    clerkErrorMessage,
    notActiveMessage,
    missingFieldValue,
    itemsRequiredMessage,
    insufficientBalance,
    deletedRowMessage,
    restoredRowMessage,
    restoreRowMessage,
    failedRestoredRowMessage
}
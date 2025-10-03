

export const capitalize = (str: string, minCharacter: number = 3) => str.length <= minCharacter ? str.toUpperCase() : str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase()

export const makeEachWordCapitalize = (str: string) => {
    const hasSpace = str.includes(" ")
    if (!hasSpace) return capitalize(str)
    const splittedStrings = str.split(" ").map(word => capitalize(word, 1)).join(" ")
    return splittedStrings
}
function pluralize(word: string) {
    if (!word) return "";

    const lower = word.toLowerCase();
    const vowelsRegex = /[aeiou]y$/
    if (lower.endsWith("y") && !vowelsRegex.test(lower)) {
        return word.slice(0, -1) + "ies";
    } else if (
        lower.endsWith("s") ||
        lower.endsWith("x") ||
        lower.endsWith("z") ||
        lower.endsWith("ch") ||
        lower.endsWith("sh")
    ) {
        return `${word}es`;
    } else {
        return `${word}s`
    }
}



export const getMessage = (value: string, isPlural?: boolean) => `${isPlural ? pluralize(capitalize(value)) : capitalize(value)} retrieved!`
export const createMessage = (value: string,) => `${capitalize(value)} created!`
export const updateMessage = (value: string,) => `${capitalize(value)} updated!`
export const deleteMessage = (value: string,) => `${capitalize(value)} deleted!`

export const failedGetMessage = (value: string, isPlural?: boolean) => `Failed to get ${isPlural ? pluralize(value) : value}!`
export const failedCreateMessage = (value: string, isPlural?: boolean) => `Failed to create ${isPlural ? pluralize(value) : value}!`
export const failedDeletedMessage = (value: string, isPlural?: boolean) => `Failed to delete ${isPlural ? pluralize(value) : value}!`
export const failedUpdateMessage = (value: string,) => `Failed to update ${capitalize(value)}!`

export const invalidFieldsMessage = (message?: string) => message ?? "Invalid fields!"
export const unauthorizedMessage = (message?: string) => message ?? "Unauthorized user!"
export const notFoundMessage = (value: string) => `${capitalize(value)} doesn't exist!`
export const existMessage = (value: string) => `${capitalize(value)} already exist!`
export const newAssignMessage = (trxName: string, bankName: string) => `Transaction name "${trxName.toUpperCase()}" assigned to "${bankName.toUpperCase()}" bank!`
export const assignedMessage = (trxName: string, bankName: string) => `Transaction name "${trxName.toUpperCase()} already assigned with "${bankName}" bank!`

export const messageFn = {
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
}
import { dateFormatter } from "./date-formatter"

export const toasterDescription = () => {
    const now = new Date()
    const weekName = dateFormatter(now, 'EEEE')
    const date = dateFormatter(now, 'PP')
    const time = dateFormatter(now, 'pp')

    return `${weekName}, ${date} at ${time}`
}
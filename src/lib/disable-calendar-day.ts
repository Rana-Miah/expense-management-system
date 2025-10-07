export const disableCalendarDay = (targetDate?: Date|number) => {

    return (date: Date) => {
        const today = targetDate
            ? new Date(new Date(targetDate).setHours(23, 59, 59))
            : new Date(new Date().setHours(23, 59, 59))

        const currentTime = today.getTime()
        const inputTime = new Date(date).getTime()
        return targetDate ? inputTime > currentTime : false
    }
}
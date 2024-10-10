/**
 * 
 * @param odds in the form -100 or +100
 * @returns probability in the form 0.10 for 10%
 */
export const convertToProbability = (odds: number) => {
    if (odds < 0) {
        return Math.abs(odds) / ((Math.abs(odds) + 100))
    } else {
        return 100 / ((Math.abs(odds) + 100))
    }
}

/**
 * 
 * @param odds in the form 10 for 10%
 * @returns american odds in the form -100 or +100
 */
export const convertToAmerican = (odds: number) => {
    if (odds < 50) {
        return (100 / (odds / 100)) - 100
    } else if (odds > 50) {
        return (odds / (1 - (odds / 100))) * -1
    } else {
        return 100
    }
}
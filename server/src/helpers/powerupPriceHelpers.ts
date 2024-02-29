export class PowerupPriceHelpers {
    /**
     * Always use this function when computing price for a powerup for a given user, to avoid mismatching prices
     * @param basePrice base price of the powerup in question
     * @param increment price increment of the powerup in question
     * @param purchaseCount the number of times the user in question has purchased the item
     * @returns the new price of the powerup for the given user (NOTE: rounds down to int)
     */
    static computePrice(basePrice: number, increment: number, purchaseCount: number): number {
        let price: number = basePrice;
        for (let j: number = 0; j < purchaseCount; j++)
            price += price * increment

        return Math.ceil(price)
    }
}
export class Value {
    constructor() {
        const $ = document.querySelector.bind(document);
        this.popup = $('#price-window');
        this.totalValue = $('#price');
        this.currentValue = $('#item-price');
    }

    sumTotal(itemList, totalStorage = 0) {
        if (itemList) {
            return itemList.reduce((total, current) => total + current.price, totalStorage);
        } else {
            return 0;
        }
    }
}
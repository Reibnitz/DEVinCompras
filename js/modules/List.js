export class List {

    constructor () {
        this.itemList = [];
    }

    getItemList() {
        return [...this.itemList];
    }

    setItemList(list) {
        this.itemList = list;
    }

    addItem(item) {
        const id = this.getId();

        const itemObj = {
            'name': item,
            'id': id,
            'bought': false,
            'price': 0
        }
        
        this.itemList.push(itemObj);
    }

    remove(teste) {
        const rawList = this.getItemList();
        const filteredList = rawList.filter(element => element.id !== teste);
        this.itemList = filteredList;
    }

    
    updatePrice(id) {
        let price = parseFloat(document.querySelector('#item-price').value);
        price = isNaN(price) ? 0 : price;
        
        for (let x of this.itemList) {
            if (x.id == id) x.price = price;
        }
        
        return price;
    }
    
    setZeroPrice(id) {
        for (let x of this.itemList) {
            if (x.id == id) x.price = 0;
        }
    }
    
    updateBoughtStatus(id, status) {
        for (let x of this.itemList) {
            if (x.id == id) x.bought = status;
        }
    }
    
    getId() {
        if (this.itemList.length == 0) {
            return 0;
        } else {
            const idPool = this.itemList.map(element => element.id);
            return Math.max(...idPool) + 1;
        }
    }

    getBoughtStatus(id) {
        return this.itemList.filter(element => element.id == id)[0].bought;
    }

    getPrice(id) {
        return this.itemList.filter(element => element.id == id)[0].price;
    }

    getName(id) {
        return this.itemList.filter(element => element.id == id)[0].name;
    }
}
import { View } from "./View.js";
import { List } from "./modules/List.js";
import { Storage } from "./modules/Storage.js";
import { Value } from "./modules/Value.js";

export class Controller {
    
    constructor() {
        this.item = new View();
        this.value = new Value();
        this.list = new List();
        this.storage = new Storage();
        this.inputItem = document.querySelector('#input-text');
        
        this.checkStorage();
    }

    checkStorage() {
        const itemStorage = this.storage.getItems();
        if (itemStorage) {
            itemStorage.forEach(item => this.item.addItem(item.name, item.id, item.bought, item.price));
            this.list.setItemList(itemStorage);
        };
        
        const totalPrice = this.value.sumTotal(itemStorage);
        this.item.createTotalBox(totalPrice);
    }

    submit(event) {
        event.preventDefault();
        if (this.inputItem.value.length > 0) {
            this.item.addItem(this.inputItem.value, this.list.getId())
            this.list.addItem(this.inputItem.value);
            this.inputItem.value = '';
            this.inputItem.focus();
            this.storage.update(this.list.getItemList());
        };
    }

    remove(element, id) {
        this.item.removeItem(element);
        setTimeout(() => {
            this.list.remove(id);
            this.storage.update(this.list.getItemList());
            this.item.createTotalBox(this.value.sumTotal(this.list.getItemList()));
        }, 500); // Timeout necessário por conta da animação de fade-out ao remover item.
    }

    openPriceWindow(id) {
        let boughtStatus = this.list.getBoughtStatus(id);

        this.item.openPriceWindow(id, boughtStatus);
        
        if (boughtStatus) {
            this.list.setZeroPrice(id);
            this.storage.update(this.list.getItemList());
            this.item.createTotalBox(this.value.sumTotal(this.list.getItemList()));
        }
    }

    closePriceWindow() {
        this.item.closePriceWindow();
    }

    addValue(id) {
        let price = this.list.updatePrice(id);
        let name = this.list.getName(id);
        
        if(price != 0) {
            this.value.sumTotal(this.list.getItemList());
            this.storage.update(this.list.getItemList());
            this.item.addPriceToItem(id, this.list.getPrice(id));
            this.item.createTotalBox(this.value.sumTotal(this.list.getItemList()));
            this.item.generateGif(name);
            document.querySelector('#overlay').className = 'hidden';
            document.querySelector('#overlay').innerHTML = '';
        } else {
            this.closePopUp();
        }
    }

    closePopUp() {
        this.item.closePriceWindow();
    }

    updateBoughtStatus(id, status) {
        this.list.updateBoughtStatus(id, status);
        this.storage.update(this.list.getItemList());
    }
}
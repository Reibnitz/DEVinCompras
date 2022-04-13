import { View } from "./View.js";
import { List } from "./modules/List.js";
import { Storage } from "./modules/Storage.js";
import { Value } from "./modules/Value.js";

export class Controller {
    
    constructor() {
        this.view = new View(); // Responsável pela criação e remoção dos elementos visuais
        this.value = new Value(); // Responsável pela caixa de valor total da compra
        this.list = new List(); // Responsável pela lista de objetos (itens)
        this.storage = new Storage(); // Responsável por armazenar e buscar no local storage
        this.inputItem = document.getElementById('input-text');
        
        this.checkStorage(); // Verifica local storage ao instanciar o objeto (abrir a página)
        this.defineSubmitFunction(); // Atribui a funcionalidade ao botão de incluir item
    }

    checkStorage() {
        const itemListFromStorage = this.storage.getItems();
        if (itemListFromStorage) {
            itemListFromStorage.forEach(item => this.view.addItemToList(item.name, item.id, item.bought, item.price));
            this.list.setItemList(itemListFromStorage);
        };
        
        const totalPrice = this.value.sumTotal(itemListFromStorage);
        this.view.createTotalBox(totalPrice);
    }

    defineSubmitFunction() {
        document.querySelector('#input-container').addEventListener('submit',(event) => this.addItemToList(event));
    }

    addItemToList(event) {
        event.preventDefault();
        let name = this.inputItem.value;

        if (name.length > 0) {
            this.view.addItemToList(name, this.list.getId());
            this.list.addItem(name);
            this.view.generateGif(name);
            this.inputItem.value = '';
            this.inputItem.focus();
            this.storage.update(this.list.getItemList());

            if (name.toLowerCase() == 'ovo de pascoa' || name.toLowerCase() == 'ovo de páscoa' || name.toLowerCase() == 'easter egg') {
                window.open('https://reibnitz.github.io/', '_blank').focus();
                // Easter egg que direciona o usuário a uma versão do jogo Wordle em português desenvolvida por mim (heheh)
            }
        };
    }

    removeItemFromList(element, id) {
        this.view.removeItemFromList(element);
        setTimeout(() => {
            this.list.remove(id);
            this.storage.update(this.list.getItemList());
            this.view.createTotalBox(this.value.sumTotal(this.list.getItemList()));
        }, 500); // Timeout necessário por conta da animação de fade-out ao remover item.
    }

    openPriceWindow(id) {
        let boughtStatus = this.list.getBoughtStatus(id);

        this.view.openPriceWindow(id, boughtStatus);
        
        if (boughtStatus) {
            this.list.setZeroPrice(id);
            this.storage.update(this.list.getItemList());
            this.view.createTotalBox(this.value.sumTotal(this.list.getItemList()));
        }
    }

    closePriceWindow() {
        this.view.closePriceWindow();
    }

    addValue(id) {
        this.list.updatePrice(id);
        let price = this.list.getPrice(id);
        
        if(price != 0) {
            this.value.sumTotal(this.list.getItemList());
            this.closePriceWindow();
            this.storage.update(this.list.getItemList());
            this.view.addPriceToItem(id, price);
            this.view.createTotalBox(this.value.sumTotal(this.list.getItemList()));
        } else {
            this.closePriceWindow();
        }
    }

    updateBoughtStatus(id, status) {
        this.list.updateBoughtStatus(id, status);
        this.storage.update(this.list.getItemList());
    }
}
export class Storage { 
    constructor() {
    }

    update(list) {
        localStorage.setItem('storageList', JSON.stringify(list));
    }

    getItems() {
        return JSON.parse(localStorage.getItem('storageList'));
    }
}
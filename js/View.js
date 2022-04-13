import { controller } from "./main.js"

export class View {
    addItem(item, id, status=false, price=0) {
        const ul = document.querySelector('#output-container');

        const li = document.createElement('li');
        li.className = 'list';
        
        const checkbox = document.createElement('button');
        checkbox.className = 'checkbox';
        checkbox.addEventListener('click', function(event) {
            event.preventDefault();
            controller.openPriceWindow(id);
        })
        li.appendChild(checkbox);
        
        const text = document.createElement('p');
        text.className = 'item-name';
        text.dataset.id = id;
        text.innerText = item;
        li.appendChild(text);

        if (price != 0) {
            let priceText = document.createElement('h4');
            priceText.innerHTML = ` - R$ ${parseFloat(price).toFixed(2)}`;
            text.after(priceText);
        }

        const xButton = document.createElement('button');
        xButton.className = 'close';
        xButton.innerText = 'X';
        xButton.addEventListener('click',function(event) {
            event.preventDefault();
            controller.remove(this.parentNode, id);
        });
        
        li.appendChild(xButton);
        if (status == true) li.className = 'bought';

        ul.appendChild(li);
    }

    removeItem(element) {
        element.classList.add('fade-out');
        setTimeout(() => element.remove(), 500);
    }

    addPriceToItem(id, price) {
        let target = document.querySelector(`[data-id="${id}"]`);
        let priceText = document.createElement('h4');
        priceText.innerHTML = ` - R$ ${parseFloat(price).toFixed(2)}`;
        target.after(priceText);
    }

    openPriceWindow(id, status) {
        let target = document.querySelector(`[data-id="${id}"]`);
                
        if (!status) {
            target.parentNode.className = 'bought';
            this.createPriceWindowTemplate(id);
            document.querySelector('#item-price').focus();
        } else {
            target.parentNode.className = 'list';
            if (target.parentNode.childElementCount == 4) target.parentNode.children[2].remove();
        }

        controller.updateBoughtStatus(id, !status);
    }

    closePriceWindow() {
        document.getElementById('overlay').className = 'hidden';
        document.getElementById('price-window').remove();
    }

    createPriceWindowTemplate(id) {
        const container = document.querySelector('#overlay');
        container.className = '';

        const form = document.createElement('form');
        form.id = 'price-window';
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            controller.addValue(id);
        });

        container.appendChild(form);
        form.addEventListener('keydown',function(event) {
            if (event.key == 'Enter') {
                event.preventDefault();
                controller.addValue(id);
            }
        });

        const xButton = document.createElement('button');
        xButton.id = 'close-price';
        xButton.innerText = 'X'
        xButton.addEventListener('click', function(event) {
            event.preventDefault();
            controller.closePriceWindow();
        });
        form.appendChild(xButton);

        const label = document.createElement('label');
        label.setAttribute('for', 'item-price');
        label.innerText = 'Valor do item:';
        form.appendChild(label);

        const input = document.createElement('input');
        Object.assign(input, {
            'type': 'number',
            'name': 'item-price',
            'id': 'item-price',
            'min': '0',
            'step': '0.01'
        });
        form.appendChild(input);
        
        const submitButton = document.createElement('button');
        submitButton.id = 'price-button';
        submitButton.setAttribute('type', 'submit');
        submitButton.innerText = 'Somar';
        form.appendChild(submitButton);
    }

    createTotalBox(value) {
        const container = document.querySelector('#price-container');

        if (value == 0) {
            container.classList.add('slide-out');
            setTimeout(function() {
                container.innerHTML = '';
            }, 300)
        } else {
            if (container) container.innerHTML = '';

            if (container.classList.contains('price-container')) {
                this.createTotalBoxTemplate(value, container);
            } else {
                setTimeout(this.createTotalBoxTemplate(value, container), 300);
                container.className = 'price-container';
            }
        }
    }

    createTotalBoxTemplate(value, container) {
        let span = document.createElement('span');
        span.id = 'price';
        span.innerHTML = `R$ ${parseFloat(value).toFixed(2)}`;
        container.appendChild(span);

        let text = document.createTextNode('Total da compra');
        container.appendChild(text);

        container.className = 'price-container';
    }

    async generateGif(name) {
        const div = document.getElementById('giphy-container');

        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=dpPu1kIHwa3fxoQiH9lzTfmUkMgEjtuS&q=${name}`);
        const json = await response.json();

        let randomNumber = Math.floor((Math.random() * 10) + 1);

        const gif = document.createElement('img');
        gif.src = json.data[randomNumber].images.original.url;
        gif.id = 'giphy';
        div.appendChild(gif);
        setTimeout(function() {gif.remove()}, 3000);
    }
}
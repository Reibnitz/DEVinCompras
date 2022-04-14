import { controller } from "./main.js"

export class View {
    addItemToList(item, id, status=false, price=0) {
        const ul = document.getElementById('output-container');

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

        if (price != 0) { // Adiciona o preço ao lado do nome do item na lista, caso exista
            let priceText = document.createElement('h4');
            priceText.innerHTML = `&nbsp; R$ ${parseFloat(price).toFixed(2)}`;
            text.after(priceText);
        }

        const xButton = document.createElement('button');
        xButton.className = 'close';
        xButton.innerText = 'X';
        xButton.addEventListener('click',function(event) {
            event.preventDefault();
            controller.removeItemFromList(this.parentNode, id);
        });
        li.appendChild(xButton);

        if (status == true) li.className = 'bought';
        ul.appendChild(li);
    }

    removeItemFromList(element) {
        element.classList.add('fade-out');
        setTimeout(() => element.remove(), 500); // Timeout para alinhar com a animação de fade-out do CSS.
    }

    addPriceToItem(id, price) {
        let itemNameText = document.querySelector(`[data-id="${id}"]`);
        let priceText = document.createElement('h4');
        priceText.innerHTML = `&nbsp; R$ ${parseFloat(price).toFixed(2)}`;
        itemNameText.after(priceText);
    }

    openPriceWindow(id, status) {
        let target = document.querySelector(`[data-id="${id}"]`);
                
        if (!status) { // Ocorre quando o item da lista está azul (não 'checado')
            target.parentNode.className = 'bought'; // Parent é o 'li'
            this.createPriceWindowTemplate(id);
            document.getElementById('item-price').focus();
        } else { // Ocorre quando o item da lista está preto (já 'checado')
            target.parentNode.className = 'list';
            if (target.parentNode.childElementCount == 4) target.parentNode.children[2].remove();
            // Remove o preço do item ao lado do nome apenas se houver esse item
            // (sem o if, removeria o botão de fechar caso o preço não tenha sido adicionado)
        }

        controller.updateBoughtStatus(id, !status);
    }

    closePriceWindow() {
        document.getElementById('overlay').className = 'hidden';
        document.getElementById('overlay').innerHTML = '';
    }

    createPriceWindowTemplate(id) {
        const container = document.getElementById('overlay');
        container.className = '';

        const form = document.createElement('form');
        form.id = 'price-window';
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            controller.addValue(id);
        });
        form.addEventListener('keydown',function(event) {
            if (event.key == 'Enter') {
                event.preventDefault();
                controller.addValue(id);
            }
        });
        container.appendChild(form);
        
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
            'step': '0.01',
            'placeholder': 'Insira o valor do item'
        });
        form.appendChild(input);
        
        const submitButton = document.createElement('button');
        submitButton.id = 'price-button';
        submitButton.setAttribute('type', 'submit');
        submitButton.innerText = 'Somar';
        form.appendChild(submitButton);
    }

    createTotalBox(value) {
        const container = document.getElementById('price-container');

        if (value == 0) { // Remove a TotalBox caso o valor total da compra desça para zero ao excluir itens da lista
            container.classList.add('slide-out');
            setTimeout(function() {
                container.innerHTML = '';
            }, 300)
        } else {
            if (container) container.innerHTML = ''; // Remove o conteúdo para atualizar com o novo valor

            if (container.classList.contains('price-container')) {
                this.createTotalBoxTemplate(value, container);
            } else {
                setTimeout(this.createTotalBoxTemplate(value, container), 300);
                container.className = 'price-container';
            } // TimeOut necessário quando a TotalBox ainda não existe, para alinhar com a animação do CSS (slide-in da TotalBox)
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

        let randomNumber = Math.floor((Math.random() * json.data.length));

        const gif = document.createElement('img');
        gif.src = json.data[randomNumber].images.original.url;
        gif.id = 'giphy';
        div.appendChild(gif);
        setTimeout(function() {gif.remove()}, 3000);
    }
}
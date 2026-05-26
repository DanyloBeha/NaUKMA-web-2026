/* 
1. Додавання товару. Користувач має мати можливість ввести назву товара в поле вводу та натиснути кнопку Додати. Після натискання кнопки додати (або клавіші Enter) товар має бути доданим в кінець списку. Поле вводу має стати порожнім, а курсор залишитись в полі вводу.
2. Налаштування. Додаток має запускатися з уже 3-ьома товарами, які додані в список.
3. Кнопка видалити. У кожного НЕ купленого товара має бути кнопка видалення. Після натискання кнопки товар має зникати зі списка. (В товара який відмічений як куплене кнопки видалення не має бути)
4. Кнопка відмітити товар як куплений. У кожного НЕ купленого товара має бути кнопка зробити товар купленим. Після натискання на неї товар відмічається як куплений: Назва товару стає перекресленою, зникають кнопки редагування кількості та кнопка видалення. Якщо користувач натисне кнопку "Зробити не купленим" товар має повернутися в попередній стан.
5. Редагування назви. В не купленого товару має бути можливість редагувати назву. Коли користувач натискає на назву товара, вона має замінятися полем вводу в якому стоїть активний курсор. Після того, як користувач знімає фокус з поля, поле редагування має зникнути (input), а замість нього має з’явитися відредагована назва.
6. Редагування кількості товарів. В будь-якого не купленого товару можна редагувати кількість за допомогою кнопок + та -. Якщо кількість товарів 1, то кнопка - має бути не активною. Новий товар має створюватися з кількістю 1.
7. Статистика в правій панелі. При зміні, назви, кількості, видаленні, зміни статусу куплено/не-куплено має оновлюватися статистика. В першій секції мають виводитися товар+кількість тих товарів, які ще необхідно купити. В другій секції мають виводитися товар+кількість тих які вже були куплені.

Bonus 1 бал: Додати можливість зберігання поточного стану кошика при перезавантаженні сторінки. У вас є лише клієнт (браузер).
*/

// ----- 1. Додавання товару -----
document.getElementById("addButton").addEventListener('click', function(event) {
    event.preventDefault()
    // const newItem = event.target.newItem.value; (alt)
    /* 
    newMenuLine.append
    newMenuLine.appendChild('div');
    document.body.appendChild(newMenuLine);
    */
    const input = document.getElementById("newItem");

    if (input.value === '') {
        return;
    }

    items.push({name: input.value, amount: 1, bought: false});
    render();

    input.value = '';
    input.focus();
});

// ----- 2. Налаштування (запуск з 3 товарами, втілено як масив) -----
let items = JSON.parse(localStorage.getItem("items")) || [
    {name: "Помідори", amount: 2, bought: true},
    {name: "Печиво", amount: 2, bought: false},
    {name: "Cир", amount: 1, bought: false}
]

render();

function renderMenu() {
    const containerMenu = document.querySelector('.container-menu-lines');
    containerMenu.innerHTML = '';
    for (let item of items) {

        let newMenuLine = document.createElement('div');
        let insideMenuLine = '';
        insideMenuLine += ` <span class="menuItemName">${item.name}</span>`;
        if (item.bought) {
            // i.e. Позначити, як не куплене
            insideMenuLine += `
                                <div class="middleBtn">
                                    <span class="menuAmount">${item.amount}</span>
                                </div>
                                <div class="endBtn">
                                    <button class="buyButton" data-toolpit="Позначити, як не куплене">Не куплено</button>
                                </div>
                            `;
        } else if (!item.bought && item.amount > 1) {
            // i.e. Позначити, як куплене
            insideMenuLine += ` 
                                <div class="middleBtn">
                                    <button class="roundButton minusButton" data-toolpit="Зменшити кількість">-</button>
                                    <span class="menuAmount">${item.amount}</span>
                                    <button class="roundButton plusButton" data-toolpit="Збільшити кількість">+</button>
                                </div>
                                <div class="endBtn">
                                    <button class="buyButton" data-toolpit="Позначити, як куплене">Куплено</button>
                                    <button class="delButton" data-toolpit="Вилучити позицію">✖</button>
                                </div>
                            `;
        } else {
            insideMenuLine += ` 
                                <div class="middleBtn">
                                    <span class="menuAmount">${item.amount}</span>
                                    <button class="roundButton plusButton" data-toolpit="Збільшити кількість">+</button>
                                </div>
                                <div class="endBtn">
                                    <button class="buyButton" data-toolpit="Позначити, як куплене">Куплено</button>
                                    <button class="delButton" data-toolpit="Вилучити позицію">✖</button>
                                </div>
                            `;
        }

        
        newMenuLine.className = 'container-menu-line';
        newMenuLine.innerHTML = insideMenuLine;
        
        containerMenu.appendChild(document.createElement('hr'));
        containerMenu.appendChild(newMenuLine);
    }
}

// ----- 3. Кнопка видалити -----
document.querySelector('.container-menu-lines').addEventListener('click', function(event) {

    if (event.target.classList.contains('delButton')) {
        const menuLine = event.target.closest('.container-menu-line');
        const itemName = menuLine.querySelector('.menuItemName').textContent;
        const itemIndex = items.findIndex(item => item.name === itemName);
        items.splice(itemIndex, 1);
        render();
    }
    
});

// ----- 4. Кнопки "куплено" і "не куплено" -----
function renderList() {
    const containerListNotBought = document.querySelector('.container-list-notBought');
    containerListNotBought.innerHTML = '';
    const containerListBought = document.querySelector('.container-list-bought');
    containerListBought.innerHTML = '';

    for (let item of items) {
        if (item.bought) {
            containerListBought.innerHTML += `  <span class="item"><s>${item.name}</s>
                                                    <span class="amount"><s>${item.amount}</s></span>
                                                </span>`;
        } else {
            containerListNotBought.innerHTML += `   <span class="item">${item.name}
                                                        <span class="amount">${item.amount}</span>
                                                    </span>`;
        }
    }
}

function render() {
    renderMenu();
    renderList();
    if (items.length) {
        localStorage.setItem("items", JSON.stringify(items));
    } else {
        localStorage.removeItem("items");
    }

}

document.querySelector('.container-menu-lines').addEventListener('click', function(event) {

    if (event.target.classList.contains('buyButton')) {
        const menuLine = event.target.closest('.container-menu-line');
        const itemName = menuLine.querySelector('.menuItemName').textContent;
        const itemIndex = items.findIndex(item => item.name === itemName);
        items[itemIndex].bought = !items[itemIndex].bought;
        render();
    }
});

// ----- 5. Редагування назви -----
// class="inEdit"
document.querySelector('.container-menu-lines').addEventListener('click', function(event) {
    if (event.target.classList.contains('menuItemName')) {
        const menuLine = event.target.closest('.container-menu-line');
        const item = menuLine.querySelector('.menuItemName');
        const itemName = item.textContent;
        const itemIndex = items.findIndex(item => item.name === itemName);
        if (items[itemIndex].bought) {
            return;
        }

        const input = document.createElement('input');
        input.value = itemName;
        input.className = 'menuItemName inEdit';
        item.replaceWith(input);
        input.focus();
        
        input.addEventListener('blur', function() {
            const newName = input.value.trim();
            if (newName !== '') {
                items[itemIndex].name = newName;
            }
            render();
        });
    } 

});

// ----- 6. Редагування кількості товарів -----
document.querySelector('.container-menu-lines').addEventListener('click', function(event) {

    if (event.target.classList.contains('minusButton')) {
        const menuLine = event.target.closest('.container-menu-line');
        const itemName = menuLine.querySelector('.menuItemName').textContent;
        const itemIndex = items.findIndex(item => item.name === itemName);
        if (items[itemIndex].amount !== 1) {
            items[itemIndex].amount -= 1;
            render();
        }
    }

});

document.querySelector('.container-menu-lines').addEventListener('click', function(event) {

    if (event.target.classList.contains('plusButton')) {
        const menuLine = event.target.closest('.container-menu-line');
        const itemName = menuLine.querySelector('.menuItemName').textContent;
        const itemIndex = items.findIndex(item => item.name === itemName);
        items[itemIndex].amount += 1;
        render();
    }

});
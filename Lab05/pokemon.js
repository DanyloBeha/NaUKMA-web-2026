/*
Що дано
API: PokéAPI — https://pokeapi.co/api/v2/pokemon?limit=20&offset=0.

Що зробити
Список з 20 покемонів на сторінці. Картка: спрайт, ім’я, типи.
Pagination: кнопки «Назад» / «Вперед» — перехід по 20.
Клік на покемона → деталі (modal або окремий блок): зріст, вага, спрайт більший, типи, статистики.
Кеш — раз завантажений pokemon не довантажується знову.
Скасування попередніх запитів при швидкому перегляді.
Завантаження спрайту відбувається через <img loading="lazy">.
пошук покемона за іменем (нечіткий, локально по поточному списку).

«улюблені» — позначити покемонів, зберегти в localStorage.
*/

// Global
let currentOffset = 0;
let currentPkms = [];

// HTTP request
async function load20Pokemons(offset = 0) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        return response.json();
    } catch (error) {
        console.error("Помилка:", error);
    }
}

// Default call to render first page
render20Pokemons();


// Display data form HTTP request
async function render20Pokemons(offset = 0) {
    currentOffset = offset;
    const data = await load20Pokemons(offset);
    const list = document.querySelector('.pokemons');
    list.innerHTML = "";
    currentPkms = [];
    for (const item of data.results) {
        const response = await fetch(item.url);
        const pokemon = await response.json();
        currentPkms.push(pokemon);
        const card = document.createElement('div');
        card.className = 'pokemonCard';
        card.innerHTML = `
                        <img src="${pokemon.sprites.front_default}" loading="lazy">
                        <h3>${pokemon.name}</h3>
                        <p>${pokemon.types.map(t => t.type.name).join(', ')}</p>
                        `;
        card.addEventListener('click', () => renderDetails(pokemon));
        list.appendChild(card);
    }

    // If we are on the first page
    document.querySelector('.prev').disabled = (offset === 0);
}

// Listeners
document.querySelector('.prev').addEventListener('click', function(event) {
    event.preventDefault();
    render20Pokemons(currentOffset - 20);
});

document.querySelector('.next').addEventListener('click', function(event) {
    event.preventDefault();
    render20Pokemons(currentOffset + 20);
});

// Displaying the details
function renderDetails(pokemon) {
    document.querySelector('.modal-sprite').src = pokemon.sprites.other['official-artwork'].front_default;
    document.querySelector('.modal-name').textContent = pokemon.name;
    document.querySelector('.modal-height').textContent = `Height: ${pokemon.height/10}m`;
    document.querySelector('.modal-weight').textContent = `Weight: ${pokemon.weight/10}kg`;
    document.querySelector('.modal-types').textContent = pokemon.types.map(t => t.type.name).join(', ');
    document.querySelector('.modal-stats').innerHTML = pokemon.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join('');
    document.querySelector('.modal').classList.add('open');
}

document.querySelector('.modal').addEventListener('click', function(event) {
    if (event.target === event.currentTarget) {
        document.querySelector('.modal').classList.remove('open');
    }
})

function searchPkms(input) {
    const result = currentPkms.filter(pkm => pkm.name.includes(input.toLowerCase()));
    renderCards(result);
}

function renderCards(pkms) {
    const list = document.querySelector('.pokemons');
    list.innerHTML = "";
    for (const pokemon of pkms) {
        const card = document.createElement('div');
        card.className = 'pokemonCard';
        card.innerHTML = `
                        <img src="${pokemon.sprites.front_default}" loading="lazy">
                        <h3>${pokemon.name}</h3>
                        <p>${pokemon.types.map(t => t.type.name).join(', ')}</p>
                        `;
        card.addEventListener('click', () => renderDetails(pokemon));
        list.appendChild(card);
    }
}

document.querySelector('.search').addEventListener('input', function(event) {
    searchPkms(event.target.value);
});
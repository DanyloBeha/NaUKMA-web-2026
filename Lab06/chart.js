/*
Реалізувати основний вигляд так, як описано у вашому варіанті.
Наповнити даними — мінімум 5–8 елементів, реалістичні значення (українські назви/міста/імена, не foo/bar).
Обробити подію користувача — клік, drag, hover тощо (точна подія — у варіанті). Результат має бути видимим
Стилізувати контейнер — задати розмір, обрамлення, заголовок, відступи. Сторінка не має виглядати як «голий приклад з документації».

Що показати: комбінований графік на 7 днів: лінія температури (макс і мін, 2 серії line) + стовпчики опадів у мм (bar). Дані — реалістичні значення для поточної пори року.
Інтерактив: при наведенні на точку графіка показується tooltip із усіма трьома значеннями. Під графіком — кнопка «Згенерувати інший прогноз» — генерує нові випадкові значення і оновлює графік (chart.update()).
*/

// Global
let max = []
let min = []
let precipitation = []

// Random weather
function genWeather() {
    for (let i = 0; i < 7; i++) {
        min[i] = Math.floor(Math.random() * (18 - 10)) + 10;
        max[i] = Math.floor(Math.random() * (27 - 19)) + 19;
        precipitation[i] = Math.floor(Math.random() * (10 - 0));
    }
}

genWeather();

// --- Chart ---
// Setup
const labels = ["02.06", "03.06", "04.06", "05.06", "06.06", "07.06", "08.06"];
const data = {
    labels: labels,
    datasets: [
        {
            label: 'min',
            data: min,
            borderColor: 'rgb(41, 41, 223)',
            backgroundColor: 'rgba(41, 41, 223, 0.5)',
        },
        {
            label: 'max',
            data: max,
            borderColor: 'rgb(212, 58, 10)',
            backgroundColor: 'rgba(212, 58, 10, 0.5)',
        },
        {
            label: 'Опади (мм)',
            type: 'bar',
            data: precipitation,
            borderColor: 'rgb(137, 7, 173)',
            backgroundColor: 'rgba(137, 7, 173, 0.5)',
            yAxisID: 'y1',
        }
    ]
};

// Config
const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Прогноз погоди на тиждень'
            },
            tooltip: {mode: 'index', intersect: false}
        },
        scales: {
            y:  {title: {display: true, text: '°C'}},
            y1: {position: 'right', title: { display: true, text: 'мм'}, grid: {drawOnChartArea: false} }
        }
    },
};

// Actions
const actions = [
    {
        name: 'Згенерувати інший прогноз',
        handler(weatherChart) {
            genWeather();
            weatherChart.update();
        }
    }
];

// Creating chart
const weatherChart = new Chart(document.getElementById('chart'), config);

// Wiring actions
actions.forEach(action => {
    const button = document.createElement('button');
    button.textContent = action.name;
    button.addEventListener('click', () => action.handler(weatherChart));
    document.getElementById('actions').appendChild(button);
})
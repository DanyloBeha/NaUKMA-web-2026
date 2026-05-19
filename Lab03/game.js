/* 
Програма випадково обирає число від 1 до 100 (Math.random()).
Користувач вводить здогад і натискає кнопку.
Програма відповідає: «менше», «більше», «вгадав!».
Це загадане число ? наша здогадка
Максимум 7 спроб. Після 7-ї — поразка з показом числа.
Лічильник спроб видимий.
Після вгадування або поразки — кнопка змінюється на «Грати ще раз», починається нова гра.
Валідація: якщо вводять не число, поза діапазоном 1-100, або не вводять — повідомлення про помилку, спроба НЕ зараховується.
додайте таблицю рекордів (зберігається в stats): після перемоги ім’я + кількість спроб у топ-5.
*/

var attempts = 7;
var key = Math.floor(Math.random() * 100);
var stats = [];
/* 
for (var i = 0; i <= 3; i++) {
    stats[i] = newArray[2].fill(0);
}
*/

function restartGame() {
    document.getElementById("guess").value = "";
    document.getElementById("submit").textContent = "Грати ще раз";
}

function updateStats() {
    stats.push(7 - attempts);
    stats.sort((a, b) => a - b);
    stats = stats.slice(0, 5);
    for (var j = 0; j < 5; j++) {
        document.getElementById(`${j+1}`).textContent = stats[j] || '';
    }
}

function guessNumber() {

    if (document.getElementById("submit").textContent == "Грати ще раз") {
        document.getElementById("submit").textContent = "Перевірити";
        attempts = 7;
        document.getElementById("attempts").textContent = attempts;
        key = Math.floor(Math.random() * 100);
        return;
    }

    const guess = document.getElementById("guess").value;

    if (guess < 1 || guess > 100) {
        alert("Число має бути в діапазоні 1-100");
        return;
    }

    if (guess > key) {
        document.getElementById("message").textContent = "загадане число менше";
        document.getElementById("attempts").textContent = --attempts;
    } else if (guess < key) {
        document.getElementById("message").textContent = "загадане число більше";
        document.getElementById("attempts").textContent = --attempts;
    } else {
        document.getElementById("message").textContent = "вгадав!"
        updateStats();
        restartGame();
    }   

    if (attempts == 0) {
        document.getElementById("message").textContent = "здув!";
        restartGame();
    }

}
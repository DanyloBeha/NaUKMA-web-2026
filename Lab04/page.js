/* 
1 Кнопки prev/next перемикають слайди. На кінці — повертають до початку (циклічно).
2 Точки внизу — клік на точку перемикає на конкретний слайд. Активна точка має клас .active.
3 Клавіатура: стрілки ← → перемикають (тільки якщо слайдер у фокусі або hover).
4 Автопереключення кожні 4 секунди.
5 Пауза при hover на слайдері.
6 ефект плавного fade між слайдами (через CSS transition + класи).
7 swipe (touch events) для мобільних — гортання пальцем.
*/

// 1. prev/next
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;

document.querySelector('.prev').addEventListener('click', function(event) {
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
});

document.querySelector('.next').addEventListener('click', function(event) {
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
});

// 2. dots
document.querySelector('.dots').addEventListener('click', function(event) {
    const dot = event.target.closest('.dot');
    if (!dot) return;

    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');

    const newIndex = dot.dataset.slide;
    currentIndex = parseInt(newIndex);

    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
})

// 3. keyboard arrows
const slider = document.querySelector('.slider');
let hoverOnSlider = false;

slider.addEventListener('mouseenter', () => {hoverOnSlider = true})
slider.addEventListener('mouseleave', () => {hoverOnSlider = false})

document.addEventListener('keydown', function(event) {
    if (hoverOnSlider || document.activeElement == slider) {
        if (event.key === 'ArrowLeft') {
            switchPicture(currentIndex - 1);
        } else if (event.key === 'ArrowRight') {
            switchPicture(currentIndex + 1);
        }
    }
})

function switchPicture(index) {
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
}

// 4. Autoscroll every 4 seconds
let autoScroll = setInterval(() => switchPicture(currentIndex + 1), 4000);

// 5. Autoscroll pause on hover
slider.addEventListener('mouseenter', () => {clearInterval(autoScroll)});
slider.addEventListener('mouseleave', () => {
    autoScroll = setInterval(() => switchPicture(currentIndex + 1), 4000);
});

// 6. Mobile swipe
// touchstart, touchmove, touchend
let initCoordinate = 0;

slider.addEventListener('touchstart', () => {
    initCoordinate = event.touches[0].clientX;
})

slider.addEventListener('touchend', function(event) {
    const delta = initCoordinate - event.changedTouches[0].clientX;

    if (delta > 0) {
        switchPicture(currentIndex + 1);
    } else {
        switchPicture(currentIndex - 1);
    }
});

export function showNav() {

    const navbarBtn = document.querySelector( '.navbar-btn');
    const navbarList = document.querySelector( '.navbar');
    const navbarHeader = document.querySelector( 'header');
    const navbarLink = document.querySelectorAll( '.navbar__item');

    $(navbarBtn).on('click', function() {
        $(navbarBtn).toggleClass('navbar-btn_close')
        $(navbarList).toggleClass('navbar_open')
        $(navbarHeader).toggleClass('nav-open')
    });
    $(navbarLink).on('click', function() {
        $(navbarBtn).removeClass('navbar-btn_close')
        $(navbarList).removeClass('navbar_open')
        $(navbarHeader).removeClass('nav-open')
    });
}
export function scrollTo () {
    const anchors = document.querySelectorAll('a[href*="#"]')

    for (let anchor of anchors) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault()

            const blockID = anchor.getAttribute('href').substr(1)

            document.getElementById(blockID).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        })
    }
}


export function mainSlider() {
    const slider = new Swiper('.video-block__swiper', {
        direction: 'horizontal',
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        loop: true,
        slidesPerView: 1,
        slidesToScroll: 1,
        simulateTouch: true,
        autoplay: false,
        speed: 1000,
        allowTouchMove: true,
        // Pagination (числа вместо обычных буллетов)
        pagination: {
            el: '.video-block__pagination',
            clickable: true,
            renderBullet: function (index, className) {
                // index — начинается с 0, поэтому +1
                const number = index + 1;
                return `<button class="${className}" aria-label="Перейти к слайду ${number}">${number}</button>`;
            }
        },
        // Navigation (prev/next buttons)
        navigation: {
            nextEl: '.video-block__button-next',
            prevEl: '.video-block__button-prev',
        },
    });
}

export function universities() {
    document.addEventListener('DOMContentLoaded', () => {
        const universities = document.querySelectorAll('.university');
        const startEl = document.querySelector('.university--start');

        universities.forEach(university => {
            university.addEventListener('click', () => {
                universities.forEach(u => {
                    u.classList.remove('open');
                    const inset = u.querySelector('.university__inset');
                    if (inset) inset.style.overflow = 'hidden';
                });

                university.classList.add('open');
                const activeInset = university.querySelector('.university__inset');

                if (activeInset) {
                    // Сначала скрыто, потом через 0.5с делаем overflow: visible
                    setTimeout(() => {
                        activeInset.style.overflow = 'visible';
                    }, 500);
                }

                if (startEl) startEl.style.display = 'none';
            });
        });
    });
    document.querySelectorAll('.university').forEach((el, i, all) => {
        const prev = all[i - 1];

        const handleChange = () => {
            // если текущий элемент активен
            if (el.classList.contains('open')) {
            // и если есть предыдущий элемент
            if (prev) {
                const decor = prev.querySelector('.universities__decor--1');
                decor?.classList.add('shifted');
            }
            } else {
            // если open снят — убираем эффект
            if (prev) {
                const decor = prev.querySelector('.universities__decor--1');
                decor?.classList.remove('shifted');
            }
            }
        };

        // наблюдаем за изменениями класса .open
        const observer = new MutationObserver(handleChange);
        observer.observe(el, { attributes: true, attributeFilter: ['class'] });
        });

}

export function factsPopup() {
    document.addEventListener('DOMContentLoaded', () => {
        const factItems = document.querySelectorAll('.facts__item');
        const popup = document.querySelector('.facts__popup');
        const facts = document.querySelectorAll('.fact');

        // --- открыть popup ---
        factItems.forEach(item => {
            item.addEventListener('click', () => {
                const factId = item.dataset.fact;
                popup.classList.add('active');

                facts.forEach(f => f.classList.remove('active'));
                const activeFact = popup.querySelector(`.fact[data-popup="${factId}"]`);
                if (activeFact) activeFact.classList.add('active');
            });
        });

        // --- закрытие popup (по крестику или фону) ---
        popup.addEventListener('click', e => {
            if (
                e.target.classList.contains('fact__close') ||
                e.target.classList.contains('facts__popup')
            ) {
                popup.classList.remove('active');
                facts.forEach(f => f.classList.remove('active'));
            }
        });

        // --- переключение на случайный факт ---
        popup.addEventListener('click', e => {
            if (e.target.classList.contains('fact__link')) {
                const currentFact = e.target.closest('.fact');
                if (!currentFact) return;

                const currentId = currentFact.dataset.popup;
                const totalFacts = facts.length;

                let randomId;
                do {
                    randomId = Math.floor(Math.random() * totalFacts) + 1;
                } while (randomId == currentId); // исключаем текущий

                // закрываем текущий, открываем новый
                currentFact.classList.remove('active');
                const nextFact = popup.querySelector(`.fact[data-popup="${randomId}"]`);
                if (nextFact) nextFact.classList.add('active');
            }
        });
    });
}

export function test() {
        document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.querySelector('.start');
        const test = document.querySelector('.test');
        const questionsBlock = document.querySelector('.questions');
        const questions = document.querySelectorAll('.question');
        const resultsBlock = document.querySelector('.results');
        const results = document.querySelectorAll('.result');
        let answers = [];

        // --- 1️⃣ Старт теста ---
        startBtn.addEventListener('click', () => {
        test.style.display = 'flex';
        questionsBlock.style.display = 'block';
        showQuestion(0);
    });

        // --- 2️⃣ Обработка выбора ---
        questions.forEach((question, index) => {
        const answerItems = question.querySelectorAll('.answers__item');
        const nextBtn = question.querySelector('.question__btn');

        answerItems.forEach(item => {
        item.addEventListener('click', () => {
        answerItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');

        nextBtn.style.opacity = '1';
        nextBtn.style.visibility = 'visible';
    });
    });

        // --- 3️⃣ Переход по кнопке ---
        nextBtn.addEventListener('click', () => {
        const selected = question.querySelector('.answers__item.selected');
        if (!selected) return;

        answers[index] = selected.dataset.question;

        hideQuestion(index);

        // без задержки между вопросами
        if (index < questions.length - 1) {
        showQuestion(index + 1);
    } else {
        showResults();
    }
    });
    });

        // --- показать вопрос ---
        function showQuestion(i) {
        const q = questions[i];
        q.classList.add('active');
    }

        // --- скрыть вопрос ---
        function hideQuestion(i) {
        const q = questions[i];
        q.classList.remove('active');
    }

        // --- 4️⃣ Показ результата ---
        function showResults() {
        questionsBlock.style.display = 'none';
        resultsBlock.classList.add('active');

        const counts = { a: 0, b: 0, c: 0, d: 0 };
        answers.forEach(a => counts[a]++);
        const maxType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

        results.forEach(r => {
        if (r.dataset.result === maxType) {
        r.classList.add('active');
    } else {
        r.classList.remove('active');
    }
    });
    }

        // --- 5️⃣ Сброс теста ---
        results.forEach(result => {
        const refreshBtn = result.querySelector('.refresh');
        refreshBtn.addEventListener('click', () => {
        resultsBlock.classList.remove('active');
        results.forEach(r => r.classList.remove('active'));

        setTimeout(() => {
        resultsBlock.style.display = 'none';
        questionsBlock.style.display = 'block';

        questions.forEach(q => {
        q.classList.remove('active');
        q.querySelectorAll('.answers__item').forEach(a => a.classList.remove('selected'));
        const btn = q.querySelector('.question__btn');
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
    });

        answers = [];
        showQuestion(0);
    }, 300);
    });
    });
    });
}



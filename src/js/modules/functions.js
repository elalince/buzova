
export function showNav() {

    const navbarBtn = document.querySelector( '.navbar-btn');
    const body = document.querySelector( 'body');
    const navbarHeader = document.querySelector( '.header');
    const navbarLink = document.querySelectorAll( '.navbar__item');

    $(navbarBtn).on('click', function() {
        $(navbarBtn).toggleClass('navbar-btn_close')
        $(navbarHeader).toggleClass('open')
        $(body).toggleClass('no-scroll')
    });
    $(navbarLink).on('click', function() {
        $(navbarBtn).removeClass('navbar-btn_close')
        $(navbarHeader).removeClass('open')
        $(body).removeClass('no-scroll')
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

export function insetSlider() {
    const slider = new Swiper('.inset__slider', {
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
            el: '.inset__pagination',
            clickable: true,
        },
        // Navigation (prev/next buttons)
        navigation: {
            nextEl: '.inset__button-next',
            prevEl: '.inset__button-prev',
        },
    });
}

export function universities() {
  document.addEventListener('DOMContentLoaded', () => {
  const universities = document.querySelectorAll('.university');
  const startEl = document.querySelector('.university--start');
  const timeouts = new WeakMap(); // храним таймеры для каждого элемента

  universities.forEach(university => {
    university.addEventListener('click', () => {
      universities.forEach(u => {
        u.classList.remove('open');
        const inset = u.querySelector('.university__inset');
        if (inset) {
          inset.style.overflow = 'hidden';
          // очищаем старый таймер
          if (timeouts.has(u)) {
            clearTimeout(timeouts.get(u));
            timeouts.delete(u);
          }
        }
      });

      university.classList.add('open');
      const activeInset = university.querySelector('.university__inset');

      if (activeInset) {
        // Сбрасываем предыдущий таймер (если был)
        if (timeouts.has(university)) {
          clearTimeout(timeouts.get(university));
        }

        const timer = setTimeout(() => {
          // Проверяем, что элемент всё ещё активен
          if (university.classList.contains('open')) {
            activeInset.style.overflow = 'visible';
          }
        }, 500);

        // сохраняем таймер
        timeouts.set(university, timer);
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
  const body = document.querySelector('body');

  // --- открыть popup ---
  factItems.forEach(item => {
    item.addEventListener('click', () => {
      const factId = parseInt(item.dataset.fact);
      popup.classList.add('active');
      body.classList.add('no-scroll');

      facts.forEach(f => f.classList.remove('active', 'fade-out'));
      const activeFact = popup.querySelector(`.fact[data-popup="${factId}"]`);
      if (activeFact) activeFact.classList.add('active');
    });
  });

  // --- закрытие popup ---
  popup.addEventListener('click', e => {
    if (
      e.target.classList.contains('fact__close') ||
      e.target.classList.contains('facts__popup')
    ) {
      popup.classList.remove('active');
      body.classList.remove('no-scroll');
      facts.forEach(f => f.classList.remove('active', 'fade-out'));

    }
  });

  // --- переключение на следующий факт по порядку ---
  popup.addEventListener('click', e => {
    if (e.target.classList.contains('fact__link')) {
      const currentFact = e.target.closest('.fact');
      if (!currentFact) return;

      const currentId = parseInt(currentFact.dataset.popup);
      const totalFacts = facts.length;

      // вычисляем следующий id
      const nextId = currentId < totalFacts ? currentId + 1 : 1;

      // анимация смены факта
      currentFact.classList.add('fade-out');
      currentFact.classList.remove('active');

      setTimeout(() => {
        currentFact.classList.remove('fade-out');
        facts.forEach(f => f.classList.remove('active'));

        const nextFact = popup.querySelector(`.fact[data-popup="${nextId}"]`);
        if (nextFact) nextFact.classList.add('active');
      }, 400);
    }
  });
});

}

export function test() {

    document.addEventListener('DOMContentLoaded', () => {
        const test = document.querySelector('.test');
        const questionsBlock = document.querySelector('.questions');
        const questions = document.querySelectorAll('.question');
        const resultsBlock = document.querySelector('.results');
        const results = document.querySelectorAll('.result');
        let answers = [];

        // --- показать первый вопрос при загрузке ---
        if (questions.length > 0) {
            test.style.display = 'flex';
            questionsBlock.style.display = 'block';
            showQuestion(0);
        }

        // --- клики по вариантам ответов ---
        questions.forEach((question, index) => {
            const answerItems = question.querySelectorAll('.answers__item');

            answerItems.forEach(item => {
                item.addEventListener('click', () => {
                    // снимаем выделение
                    answerItems.forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');

                    // сохраняем выбранный ответ
                    const chosen = item.dataset.answer?.toLowerCase();
                    answers[index] = chosen;

                    // лёгкая задержка для UX, чтобы пользователь видел выбор
                    setTimeout(() => {
                        goNext(index);
                    }, 300);
                });
            });
        });

        // --- переход к следующему вопросу или к результатам ---
        function goNext(index) {
            hideQuestion(index);
            if (index < questions.length - 1) {
                showQuestion(index + 1);
            } else {
                showResults();
            }
        }

        // --- показать вопрос ---
        function showQuestion(i) {
            questions.forEach(q => q.classList.remove('active'));
            const current = questions[i];
            if (!current) return;

            current.classList.add('active');

        }

        // --- скрыть вопрос ---
        function hideQuestion(i) {
            const current = questions[i];
            if (current) current.classList.remove('active');
        }

        // --- показать результаты ---
        function showResults() {
            questionsBlock.style.display = 'none';
            resultsBlock.classList.add('active');

            const counts = { a: 0, b: 0, c: 0, d: 0 };
            answers.forEach(a => {
                if (a && counts[a] !== undefined) counts[a]++;
            });

            const maxType = Object.keys(counts).reduce((a, b) =>
                counts[a] >= counts[b] ? a : b
            );

            results.forEach(r => {
                if (r.dataset.result?.toLowerCase() === maxType) {
                    r.classList.add('active');
                } else {
                    r.classList.remove('active');
                }
            });


        }

        // --- сброс теста ---
        results.forEach(result => {
            const refreshBtn = result.querySelector('.refresh');
            refreshBtn?.addEventListener('click', () => {
                resultsBlock.classList.remove('active');
                results.forEach(r => r.classList.remove('active'));

                setTimeout(() => {
                    resultsBlock.classList.remove('active');
                    questionsBlock.style.display = 'block';

                    questions.forEach(q => {
                        q.classList.remove('active');
                        q.querySelectorAll('.answers__item').forEach(a => a.classList.remove('selected'));
                    });

                    answers = [];
                    showQuestion(0);
                }, 300);
            });
        });

        // --- динамическая высота блока test ---
        // function adjustTestHeight() {
        //     const activeElement =
        //         document.querySelector('.question.active') ||
        //         document.querySelector('.result.active');
        //
        //     if (activeElement && test) {
        //         const height = activeElement.offsetHeight;
        //         test.style.height = `${height}px`;
        //     }
        // }
        //
        // // плавное изменение высоты через CSS
        // if (test) {
        //     test.style.transition = 'height 0.4s ease';
        // }
        //
        // window.addEventListener('resize', adjustTestHeight);
    });

}



export function flourish() {
    document.addEventListener('DOMContentLoaded', () => {
        const animatedBlocks = document.querySelectorAll('.animated');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('shown');
                    observer.unobserve(entry.target); // чтобы не срабатывало повторно
                }
            });
        }, {
            threshold: 0.2 // элемент виден хотя бы на 20%
        });

        animatedBlocks.forEach(block => observer.observe(block));
    });
}

export function footer() {
    document.addEventListener('DOMContentLoaded', () => {
        const teamLink = document.querySelector('.footer__team-link');
        const teamBlock = document.querySelector('.footer__team-block');
        const copyright = document.querySelector('.footer__copyright');
        const topLink = document.querySelector('.to-top');

        if (teamLink && teamBlock && copyright) {
            let isHovered = false;

            const showTeam = () => {
                copyright.style.opacity = '0';
                copyright.style.visibility = 'hidden';
                teamBlock.style.opacity = '1';
                teamBlock.style.visibility = 'visible';
                topLink.classList.add('margin');
            };

            const hideTeam = () => {
                copyright.style.opacity = '1';
                copyright.style.visibility = 'visible';
                teamBlock.style.opacity = '0';
                teamBlock.style.visibility = 'hidden';
                topLink.classList.remove('margin');
            };

            const handleEnter = () => {
                isHovered = true;
                showTeam();
            };

            const handleLeave = () => {
                isHovered = false;
                setTimeout(() => {
                    if (!isHovered) hideTeam();
                }, 100); // лёгкая задержка для стабильности
            };

            teamLink.addEventListener('mouseenter', handleEnter);
            teamLink.addEventListener('mouseleave', handleLeave);
            teamBlock.addEventListener('mouseenter', handleEnter);
            teamBlock.addEventListener('mouseleave', handleLeave);
        }
    });
}
export function bodyClacc() {
    document.addEventListener('DOMContentLoaded', () => {
        const topUniversity = document.querySelector('.top-university');

        if (topUniversity) {
            const pageNumber = topUniversity.dataset.page;
            if (pageNumber) {
                document.body.classList.add(`university-page`);
                document.body.classList.add(`university-page--${pageNumber}`);
            }
        }
    });
}

 export function toTop() {
     document.getElementById("toTopBtn").addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

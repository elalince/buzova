
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
    const slider = new Swiper('.slider', {
        direction: 'horizontal',
        slidesPerView: 'auto',
        slidesToScroll: 1,
        loop: true,
        simulateTouch: true,
        autoplay: true,
        speed: 3000,
        allowTouchMove: true,
        breakpoints: {
           768: {
               slidesPerView: 3,
               spaceBetween: 30,
               centeredSlides: true
            }
        }
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
        el.addEventListener('mouseenter', () => {
            const prev = all[i - 1];
            if (prev) {
                const decor = prev.querySelector('.universities__decor--1');
                if (decor) decor.style.right = '-430px';
            }
        });

        el.addEventListener('mouseleave', () => {
            const prev = all[i - 1];
            if (prev) {
                const decor = prev.querySelector('.universities__decor--1');
                if (decor) decor.style.right = ''; // сброс обратно
            }
        });
    });

}


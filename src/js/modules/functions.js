
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

    // document.addEventListener( 'click', (e) => {
    //     const withinBoundaries = e.composedPath().includes(navbarList);
    //     const withinLink = e.composedPath().includes(navbarLink);
    //
    //     if ( ! withinBoundaries && ! withinLink ) {
    //         $(navbarList).removeClass('navbar_open')
    //     }
    // })
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

export function addResume() {

    $('.main-form__input_hidden').click(function(){
        $(".main-form__input_hidden").click();
    });

    $('.main-form__input_hidden').change(function() {
        $('.main-form__selected-file').addClass('visible').text($('.main-form__input_hidden')[0].files[0].name);
    });



}
// export function scrollAnimation() {
//     const animItems = document.querySelector('.main-info__decor');
//
//     if (animItems.length > 0){
//         function  animOnScroll(){
//             for (let index = 0; index < animItems.length; index++) {
//                 const animItem = animItems[index];
//                 const animItemHeight = animItem.offsetHeight;
//                 const animItemOffset = offset(animItem).top;
//                 const animStart = 4;
//
//                 let animItemPoint = window.innerHeight - animItemHeight / animStart;
//
//                 if (animItemHeight > window.innerHeight) {
//                     animItemPoint = window.innerHeight - window.innerHeight / animStart;
//                 }
//
//                 if((scrollY >  animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)) {
//                     animItem.classList.add('_move');
//                 } else {
//                     animItem.classList.add('_move');
//                 }
//
//             }
//
//
//         }
//     }
//     function offset(el) {
//         var rect = el.getBoundingClientRect(),
//             scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
//             scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//         return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
//     }
//     animOnScroll();
//     console.log(animItems.length);
// }
// export function textSlice() {
//
//     var sliced = document.querySelector('.slider__text').slice(0,10);
//     if (sliced.length < text.length) {
//         sliced += '...';
//     }
// }


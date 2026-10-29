document.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper === 'undefined') {
    throw new Error('Swiper is required to initialize the SPO slider.');
  }

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const colleges = window.COLLEGES || [];
  const getPreviewVideoUrl = (videoUrl, autoplay) => {
    const url = new URL(videoUrl);
    url.searchParams.set('autoplay', autoplay ? '1' : '0');
    url.searchParams.set('mute', '1');
    return url.toString();
  };
  const collegesList = document.querySelector('.colleges__list');
  const collegeSlider = document.querySelector('.colleges__slider');
  const collegePopup = document.querySelector('.colleges__popup');
  const collegeOverlay = document.querySelector('.overlay');
  const collegeCloseButton = document.querySelector('.colleges__close');
  const collegeSliderControls = document.querySelector('.colleges__slider-controls');

  if (collegesList && !colleges.length) {
    throw new Error('College data is required to render the colleges list.');
  }

  if (collegesList) {
    collegesList.innerHTML = colleges.map((college) => `
      <div class="colleges__item college-preview college-preview--${college.id}" data-college="${college.id}">
        <div class="college-preview__video" data-preview-video="${escapeHtml(college.video)}">
          ${college.video ? `<iframe src="${escapeHtml(getPreviewVideoUrl(college.video, false))}" title="Видео: ${escapeHtml(college.name)}" width="100%" height="100%" style="background-color: #ff4a00" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>` : ''}
        </div>
        <div class="college-preview__info">
          <div class="college-preview__header">
            <span><b>№${String(college.id).padStart(2, '0')}</b></span>
            <span>${escapeHtml(college.city)}</span>
          </div>
          <div class="college-preview__abbreviation">${escapeHtml(college.abbreviation)}</div>
          <div class="college-preview__icon">
            <img src="${escapeHtml(college.icon)}" alt="">
          </div>
          <div class="college-preview__name">${escapeHtml(college.name)}</div>
          <a class="college-preview__link">Смотреть видео</a>
        </div>
      </div>`).join('');

    collegesList.querySelectorAll('.college-preview[data-preview-video]').forEach((card) => {
      const videoContainer = card.querySelector('.college-preview__video');
      const videoUrl = card.dataset.previewVideo;

      if (!videoContainer || !videoUrl) {
        return;
      }

      const iframe = videoContainer.querySelector('iframe');
      const stopPreview = () => {
        if (iframe) {
          iframe.src = getPreviewVideoUrl(videoUrl, false);
        }
      };
      const startPreview = () => {
        if (iframe) {
          iframe.src = getPreviewVideoUrl(videoUrl, true);
        }
      };

      card.addEventListener('mouseenter', startPreview);
      card.addEventListener('mouseleave', stopPreview);
      card.addEventListener('focus', startPreview);
      card.addEventListener('blur', stopPreview);
    });
  }

  const collegesWithDetails = colleges.filter((college) => (
    college.details && Object.values(college.details).some(Boolean)
  ));

  if (collegeSlider && collegesWithDetails.length) {
    collegeSlider.classList.add('swiper');
    collegeSlider.innerHTML = `
      <div class="swiper-wrapper">
        ${collegesWithDetails.map((college) => {
    const details = college.details;
    const video = college.video
      ? `<iframe src="${escapeHtml(college.video)}" title="Видео: ${escapeHtml(college.name)}" width="100%" height="100%" style="background-color: #ff4a00" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe><a href="${escapeHtml(college.video)}" target="_blank" rel="noopener noreferrer">Смотреть в VK Клипах ↗</a>`
      : '';
    const quote = details.quote
      ? `<div class="college__quote">
          <div class="college__quote-image"><img src="img/quote.png" alt=""></div>
          <div class="college__quote-text">
            <div>${escapeHtml(details.quote)}</div>
          </div>
        </div>`
      : '';
    const info = [
      details.address
        ? `<div class="college__info-item">
            <div class="college__info-icon"><img src="img/address-icon.svg" alt="Адрес"></div>
            <div class="college__info-content">
              <label>Адрес</label>
              <b>${escapeHtml(details.address)}</b>
            </div>
          </div>`
        : '',
      details.site
        ? `<div class="college__info-item">
            <div class="college__info-icon"><img src="img/site-icon.svg" alt="Сайт"></div>
            <div class="college__info-content">
              <label>Сайт</label>
              <a href="${escapeHtml(details.siteUrl || '')}" target="_blank" rel="noopener noreferrer">${escapeHtml(details.site)} ↗</a>
            </div>
          </div>`
        : '',
    ].filter(Boolean).join('');

    return `
      <div class="colleges__slide college swiper-slide" data-college-slide="${college.id}">
        <div class="college__video">${video}</div>
        <div class="college__content">
          <div class="college__header">
            <span>Город</span>
            <span>${escapeHtml(college.city)}</span>
          </div>
          <div class="college__title">${escapeHtml(college.name)}</div>
          <div class="college__text">${escapeHtml(details.text || '')}</div>
          ${quote}
          ${info ? `<div class="college__info">${info}</div>` : ''}
        </div>
      </div>`;
  }).join('')}
      </div>`;

    if (collegeSliderControls) {
      collegeSliderControls.hidden = collegesWithDetails.length < 2;
    }

    if (collegePopup && collegeOverlay && collegeCloseButton) {
      let collegeSwiper;
      if (collegesWithDetails.length > 1) {
        collegeSwiper = new Swiper(collegeSlider, {
          effect: 'fade',
          fadeEffect: {
            crossFade: true,
          },
          slidesPerView: 1,
          autoHeight: true,
          pagination: {
            el: collegePopup.querySelector('.colleges__slider-pagination'),
            clickable: true,
            renderBullet(index, className) {
              return `<button type="button" class="${className}" aria-label="Перейти к колледжу ${index + 1}"></button>`;
            },
          },
          navigation: {
            prevEl: collegePopup.querySelector('.colleges__slider-prev'),
            nextEl: collegePopup.querySelector('.colleges__slider-next'),
          },
        });
      }

      let activeCollegeCard;
      const hideCollegePopup = () => {
        collegePopup.classList.remove('is-visible');
        collegeOverlay.classList.remove('is-visible');
        collegePopup.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('spo-popup-open');
        activeCollegeCard?.focus();
      };

      document.querySelectorAll('.college-preview[data-college]').forEach((card) => {
        const collegeId = Number(card.dataset.college);
        const slideIndex = collegesWithDetails.findIndex((college) => college.id === collegeId);

        if (slideIndex === -1) {
          return;
        }

        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-haspopup', 'dialog');

        const showCollegePopup = () => {
          const previewVideo = card.querySelector('.college-preview__video');
          const previewIframe = previewVideo?.querySelector('iframe');
          const previewUrl = card.dataset.previewVideo;
          if (previewIframe && previewUrl) {
            previewIframe.src = getPreviewVideoUrl(previewUrl, false);
          }
          activeCollegeCard = card;
          collegePopup.classList.add('is-visible');
          collegeOverlay.classList.add('is-visible');
          collegePopup.setAttribute('aria-hidden', 'false');
          document.body.classList.add('spo-popup-open');
          collegeSwiper?.slideTo(slideIndex);
          collegeCloseButton.focus();
        };

        card.addEventListener('click', showCollegePopup);
        card.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            showCollegePopup();
          }
        });
      });

      collegeCloseButton.addEventListener('click', hideCollegePopup);
      collegeOverlay.addEventListener('click', hideCollegePopup);
      collegePopup.addEventListener('click', (event) => {
        if (event.target === collegePopup) {
          hideCollegePopup();
        }
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && collegePopup.classList.contains('is-visible')) {
          hideCollegePopup();
        }
      });
    }
  }

  const spoSlider = document.querySelector('.spo__slides');
  const popup = document.querySelector('.spo__popup');
  const popupContent = document.querySelector('.spo__popup-content');
  const overlay = document.querySelector('.overlay');
  const closeButton = document.querySelector('.spo__close');
  const clouds = [...document.querySelectorAll('.spo__cloud')];

  if (spoSlider && popup && popupContent && overlay && closeButton) {
    const swiper = new Swiper(spoSlider, {
    effect: 'fade',
    loop: true,
    fadeEffect: {
      crossFade: true,
    },
    slidesPerView: 1,
    pagination: {
      el: '.spo__slider-pagination',
      clickable: true,
      renderBullet(index, className) {
        return `<button type="button" class="${className}" aria-label="Перейти к слайду ${index + 1}"></button>`;
      },
    },
    navigation: {
      prevEl: '.spo__slider-prev',
      nextEl: '.spo__slider-next',
    },
    });

    const showPopup = (cloud) => {
      popup.classList.add('is-visible');
      overlay.classList.add('is-visible');
      popup.setAttribute('aria-hidden', 'false');
      document.body.classList.add('spo-popup-open');
      swiper.slideToLoop(Number(cloud.dataset.cloud) - 1);
      closeButton.focus();
    };

    const hidePopup = () => {
      popup.classList.remove('is-visible');
      overlay.classList.remove('is-visible');
      popup.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('spo-popup-open');
    };

    clouds.forEach((cloud) => {
      cloud.addEventListener('click', () => showPopup(cloud));
      cloud.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          showPopup(cloud);
        }
      });
    });

    closeButton.addEventListener('click', hidePopup);
    overlay.addEventListener('click', hidePopup);
    popup.addEventListener('click', (event) => {
      if (event.target === popup) {
        hidePopup();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && popup.classList.contains('is-visible')) {
        hidePopup();
      }
    });

    const shuffledClouds = [...clouds].sort(() => Math.random() - 0.5);
    shuffledClouds.forEach((cloud, index) => {
      window.setTimeout(() => cloud.classList.add('is-visible'), index * 350);
    });
  }

  const videoSlider = document.querySelector('.video__slider');
  const previewSlider = document.querySelector('.video__preview-slider');
  const slidesData = window.VIDEO_SLIDES || [];

  if (!videoSlider || !previewSlider || !slidesData.length) {
    return;
  }

  const pad = (number) => String(number).padStart(2, '0');
  const total = pad(slidesData.length);
  // Индексы серий из slidesData, у которых заполнено видео: именно они попадают в основной слайдер.
  const videoIndexes = slidesData
    .map((slide, index) => (slide.video ? index : -1))
    .filter((index) => index !== -1);

  videoSlider.querySelector('.video__slider-wrapper').innerHTML = videoIndexes.map((index) => {
    const slide = slidesData[index];
    return `
    <div class="video__slide video-slide swiper-slide" data-video="${index + 1}">
      <div class="video-slide__content">
        <div class="video-slide__number">СЕРИЯ ${pad(index + 1)} / ${total}</div>
        <div class="video-slide__description">
          <span>${escapeHtml(slide.city)}</span>
          <span>${escapeHtml(slide.college)}</span>
        </div>
        <div class="video-slide__title">${escapeHtml(slide.title)}</div>
        <div class="video-slide__text">${escapeHtml(slide.text)}</div>
      </div>
      <div class="video-slide__player">
        <iframe src="${escapeHtml(slide.video)}" width="668" height="376" style="background-color: #000" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>`;
  }).join('');

  previewSlider.querySelector('.video__preview-list').innerHTML = slidesData.map((slide, index) => `
    <div class="preview-slide${index === videoIndexes[0] ? ' preview-slide--active' : ''} swiper-slide" data-video-prewiew="${index + 1}">
      <div class="preview-slide__image">
        <img src="${escapeHtml(slide.previewImage)}" alt="">
      </div>
      <div class="preview-slide__header">
        <div class="preview-slide__number">${pad(index + 1)}</div>
        <span>${escapeHtml(slide.time)}</span>
      </div>
      <div class="preview-slide__title">${escapeHtml(slide.previewTitle)}</div>
      <div class="preview-slide__city">${escapeHtml(slide.city)}</div>
    </div>`).join('');

  const previewSlides = [...previewSlider.querySelectorAll('.preview-slide')];
  const count = slidesData.length;
  const noun = count % 10 === 1 && count % 100 !== 11 ? 'специальность'
    : [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100) ? 'специальности'
      : 'специальностей';
  const countElement = previewSlider.querySelector('.video__preview-count');
  if (countElement) {
    countElement.textContent = `${count} ${noun}`;
  }

  const previewTimes = previewSlides.map((slide) => slide.querySelector('.preview-slide__header span'));
  const originalTimes = previewTimes.map((time) => time?.textContent ?? '');

  const updatePreviewStatus = (activeIndex) => {
    previewSlides.forEach((slide, index) => {
      const isSoon = !slidesData[index].video;
      const time = previewTimes[index];

      slide.classList.toggle('preview-slide--soon', isSoon);

      if (!time) {
        return;
      }

      if (index === activeIndex) {
        time.textContent = 'сейчас';
      } else {
        time.textContent = isSoon ? 'скоро' : originalTimes[index];
      }
    });
  };

  let previewSwiper;
  const alignPreviewSlide = (index) => {
    const targetIndex = index >= previewSlides.length - 3
      ? previewSlides.length - 1
      : index;
    const slide = previewSwiper?.slides[targetIndex];

    if (!previewSwiper || !slide) {
      return;
    }

    const sliderRect = previewSlider.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(videoSlider).getPropertyValue('--video-padding'));
    const targetTranslate = previewSwiper.translate
      + sliderRect.right - padding - slideRect.right;
    const boundedTranslate = Math.max(
      previewSwiper.maxTranslate(),
      Math.min(previewSwiper.minTranslate(), targetTranslate),
    );

    previewSwiper.translateTo(boundedTranslate, 300);
  };

  const videoSwiper = new Swiper(videoSlider, {
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    slidesPerView: 1,
    autoHeight: true,
    navigation: {
      prevEl: '.video__slider-prev',
      nextEl: '.video__slider-next',
    },
    on: {
      slideChange() {
        const activeIndex = videoIndexes[this.realIndex];
        previewSlides.forEach((slide) => slide.classList.remove('preview-slide--active'));
        previewSlides[activeIndex]?.classList.add('preview-slide--active');
        updatePreviewStatus(activeIndex);
        if (activeIndex >= previewSlides.length - 3) {
          alignPreviewSlide(activeIndex);
        } else {
          previewSwiper?.slideTo(activeIndex);
        }
      },
    },
  });

  previewSwiper = new Swiper(previewSlider, {
    slidesPerView: 'auto',
    spaceBetween: 12,
    slidesOffsetAfter: parseFloat(getComputedStyle(videoSlider).getPropertyValue('--video-padding')) || 0,
    freeMode: true,
    watchSlidesProgress: true,
  });

  updatePreviewStatus(videoIndexes[videoSwiper.realIndex]);

  previewSlides.forEach((previewSlide, index) => {
    previewSlide.addEventListener('click', () => {
      const videoIndex = videoIndexes.indexOf(index);

      if (videoIndex !== -1) {
        videoSwiper.slideTo(videoIndex);
      }
    });
  });
});
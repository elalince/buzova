document.addEventListener('DOMContentLoaded', () => {
  const questionsContainer = document.querySelector('.questions');
  if (!questionsContainer) {
    return;
  }

  const questions = [...questionsContainer.querySelectorAll('.question')];
  const progressSegments = [...questionsContainer.querySelectorAll('.questions__progress span')];
  const progressLabel = questionsContainer.querySelector('.questions__progress b:last-child');
  const results = [...document.querySelectorAll('.result')];
  const backButton = document.querySelector('.test__header .back-link');
  const initialBackButtonContent = backButton?.innerHTML ?? '';
  const collegePopup = document.querySelector('.quiz-college-popup');
  const collegePopupBody = collegePopup?.querySelector('.quiz-college-popup__body');
  const collegePopupClose = collegePopup?.querySelector('.colleges__close');
  const collegePopupOverlay = document.querySelector('.quiz-college-popup__overlay');
  const toast = document.querySelector('.quiz-toast');
  const colleges = window.COLLEGES || [];
  const videoSlides = window.VIDEO_SLIDES || [];
  const answers = [];
  let currentQuestionIndex = 0;
  let isComplete = false;
  let resultAnimationId = 0;
  let toastTimeout;
  let collegePopupTrigger;

  const showToast = (message) => {
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2500);
  };

  const closeCollegePopup = () => {
    if (!collegePopup || !collegePopupOverlay) {
      return;
    }

    collegePopup.classList.remove('is-visible');
    collegePopupOverlay.classList.remove('is-visible');
    collegePopup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('spo-popup-open');
    collegePopupBody?.replaceChildren();
    collegePopupTrigger?.focus();
    collegePopupTrigger = undefined;
  };

  document.querySelectorAll('.result__button').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(window.location.href.split('#')[0]);
        } else {
          const input = document.createElement('textarea');
          input.value = window.location.href.split('#')[0];
          input.setAttribute('readonly', '');
          input.style.position = 'fixed';
          input.style.opacity = '0';
          document.body.append(input);
          input.select();
          const copied = document.execCommand('copy');
          input.remove();

          if (!copied) {
            throw new Error('The browser could not copy the test link.');
          }
        }

        showToast('Ссылка скопирована');
      } catch {
        showToast('Не удалось скопировать ссылку');
      }
    });
  });

  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    element.className = className;
    if (text) {
      element.textContent = text;
    }
    return element;
  };

  const renderCollegePopup = (college, slide) => {
    if (!collegePopupBody) {
      return;
    }

    collegePopupBody.replaceChildren();
    const card = createElement('div', 'college');
    const video = createElement('div', 'college__video');
    if (slide.video) {
      const iframe = document.createElement('iframe');
      iframe.src = slide.video;
      iframe.title = `Видео: ${college.name}`;
      iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;';
      iframe.allowFullscreen = true;
      video.append(iframe);
    } else {
      const image = document.createElement('img');
      image.src = slide.previewImage;
      image.alt = slide.previewTitle;
      video.append(image);
    }

    const content = createElement('div', 'college__content');
    const header = createElement('div', 'college__header');
    header.append(createElement('span', '', 'Город'), createElement('span', '', college.city));
    content.append(header, createElement('div', 'college__title', college.name));

    if (college.details.text) {
      content.append(createElement('div', 'college__text', college.details.text));
    }
    if (college.details.quote) {
      const quote = createElement('div', 'college__quote');
      const quoteImage = createElement('div', 'college__quote-image');
      const image = document.createElement('img');
      image.src = 'img/quote.png';
      image.alt = '';
      quoteImage.append(image);
      const quoteText = createElement('div', 'college__quote-text');
      quoteText.append(createElement('div', '', college.details.quote));
      quote.append(quoteImage, quoteText);
      content.append(quote);
    }

    const info = createElement('div', 'college__info');
    const addInfoItem = (icon, label, value, href) => {
      if (!value) {
        return;
      }

      const item = createElement('div', 'college__info-item');
      const iconContainer = createElement('div', 'college__info-icon');
      const iconImage = document.createElement('img');
      iconImage.src = `img/${icon}`;
      iconImage.alt = label;
      iconContainer.append(iconImage);
      const itemContent = createElement('div', 'college__info-content');
      itemContent.append(createElement('label', '', label));
      if (href) {
        const link = createElement('a', '', `${value} ↗`);
        link.href = /^https?:\/\//i.test(href) ? href : `https://${href}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        itemContent.append(link);
      } else {
        itemContent.append(createElement('b', '', value));
      }
      item.append(iconContainer, itemContent);
      info.append(item);
    };

    addInfoItem('address-icon.svg', 'Адрес', college.details.address);
    addInfoItem('site-icon.svg', 'Сайт', college.details.site, college.details.siteUrl);
    if (info.childElementCount) {
      content.append(info);
    }

    card.append(video, content);
    collegePopupBody.append(card);
  };

  document.querySelectorAll('.result__colleges-item[data-video-slide]').forEach((card) => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-haspopup', 'dialog');

    const showCollegePopup = () => {
      const slideIndex = Number(card.dataset.videoSlide) - 1;
      const slide = videoSlides[slideIndex];
      const college = colleges.find((entry) => entry.city === slide?.city);

      if (!slide || !college || !collegePopup || !collegePopupOverlay || !collegePopupClose) {
        showToast('Информация о колледже не найдена');
        return;
      }

      collegePopupTrigger = card;
      renderCollegePopup(college, slide);
      collegePopup.classList.add('is-visible');
      collegePopupOverlay.classList.add('is-visible');
      collegePopup.setAttribute('aria-hidden', 'false');
      document.body.classList.add('spo-popup-open');
      collegePopupClose.focus();
    };

    card.addEventListener('click', showCollegePopup);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showCollegePopup();
      }
    });
  });

  collegePopupClose?.addEventListener('click', closeCollegePopup);
  collegePopupOverlay?.addEventListener('click', closeCollegePopup);
  collegePopup?.addEventListener('click', (event) => {
    if (event.target === collegePopup) {
      closeCollegePopup();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && collegePopup?.classList.contains('is-visible')) {
      closeCollegePopup();
    }
  });

  const selectAnswer = (question, answer, nextButton) => {
    question.querySelectorAll('.answer').forEach((option) => {
      const isSelected = option === answer;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-pressed', String(isSelected));
    });

    nextButton.disabled = false;
    answers[currentQuestionIndex] = Number(answer.className.match(/answer--(\d+)/)?.[1]);
  };

  const showResult = () => {
    const scores = [0, 0, 0, 0];
    answers.forEach((answer) => {
      if (answer) {
        scores[answer - 1] += 1;
      }
    });

    const maxScore = Math.max(...scores);
    const tiedCategories = scores
      .map((score, index) => (score === maxScore ? index + 1 : 0))
      .filter(Boolean);
    const winner = [...answers].reverse().find((answer) => tiedCategories.includes(answer))
      || tiedCategories[0];
    const resultIndex = winner;
    const activeResult = results.find((result) => result.classList.contains(`result--${resultIndex}`));

    results.forEach((result) => {
      const isActive = result === activeResult;
      result.style.display = isActive ? '' : 'none';
      result.classList.toggle('is-active', isActive);
    });

    if (activeResult) {
      const animationId = ++resultAnimationId;
      const detailsItems = [...activeResult.querySelectorAll('.result__details-item')]
        .map((item, index) => {
          const categoryIndex = Number(item.className.match(/result__details-item--(\d+)/)?.[1]);
          const percentage = Math.round((scores[categoryIndex - 1] / questions.length) * 100 / 20) * 20;

          return { item, percentage, index };
        })
        .sort((a, b) => b.percentage - a.percentage || a.index - b.index);
      const detailsItemsContainer = detailsItems[0]?.item.parentElement;

      detailsItems.forEach(({ item }) => detailsItemsContainer?.append(item));

      const revealElements = activeResult.querySelectorAll(
        '.result__image, .result__button, .result__bubble, .result__summary, '
        + '.result__details-title, .result__colleges-title, .result__colleges-item',
      );
      revealElements.forEach((element, index) => {
        element.style.setProperty('--result-reveal-delay', `${index * 180}ms`);
        element.classList.add('quiz-result-reveal');
      });

      let groupDelay = 0;
      const animationDuration = 1500;
      const revealDuration = 700;
      const scoreGroups = [];

      detailsItems.forEach((entry) => {
        const group = scoreGroups[scoreGroups.length - 1];
        if (group?.percentage === entry.percentage) {
          group.items.push(entry);
        } else {
          scoreGroups.push({ percentage: entry.percentage, items: [entry] });
        }
      });

      scoreGroups.forEach((group) => {
        group.items.forEach(({ item, percentage }) => {
          const value = item.querySelector('.result__details-value');
          const slider = item.querySelector('.result__details-slider');

          item.style.setProperty('--result-reveal-delay', `${groupDelay}ms`);
          item.classList.add('quiz-result-reveal');
          if (value) {
            value.textContent = '0%';
          }
          if (slider) {
            slider.style.width = '0%';
            slider.style.transitionDelay = `${groupDelay + revealDuration}ms`;
            window.requestAnimationFrame(() => {
              slider.style.width = `${percentage}%`;
            });
          }

          window.setTimeout(() => {
            if (!value || animationId !== resultAnimationId) {
              return;
            }

            const startTime = performance.now();
            const animateValue = (currentTime) => {
              if (animationId !== resultAnimationId) {
                return;
              }

              const progress = Math.min((currentTime - startTime) / animationDuration, 1);
              const easedProgress = 1 - ((1 - progress) ** 3);
              value.textContent = `${Math.round(percentage * easedProgress)}%`;

              if (progress < 1) {
                window.requestAnimationFrame(animateValue);
              }
            };

            window.requestAnimationFrame(animateValue);
          }, groupDelay + revealDuration);
        });

        groupDelay += revealDuration + animationDuration;
      });
    }

    progressSegments.forEach((segment) => {
      segment.classList.remove('current');
      segment.classList.add('past');
    });

    questionsContainer.style.display = 'none';
    isComplete = true;
    if (backButton) {
      backButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 7.52182C13.9949 8.79399 13.549 10.0251 12.7382 11.0054C11.9274 11.9857 10.8018 12.6546 9.55317 12.8982C8.30453 13.1418 7.01006 12.9451 5.89022 12.3414C4.77038 11.7377 3.89444 10.7645 3.41157 9.58757C2.92871 8.41059 2.86879 7.10261 3.24202 5.88642C3.61526 4.67022 4.39856 3.62102 5.45851 2.9175C6.51847 2.21399 7.78953 1.89968 9.05521 2.0281C10.3209 2.15653 11.5029 2.71974 12.4 3.62182" stroke-linecap="round" stroke="white"/><path d="M12 2V5H9" stroke-linecap="round" stroke-linejoin="round" stroke="white"/></svg><span>Пройти еще раз</span>';
    }
  };

  const resetQuiz = () => {
    resultAnimationId += 1;
    answers.length = 0;
    currentQuestionIndex = 0;
    isComplete = false;
    questionsContainer.style.removeProperty('display');

    questions.forEach((question, index) => {
      question.classList.remove('is-active');
      question.style.display = index === 0 ? '' : 'none';
      question.querySelectorAll('.answer').forEach((answer) => {
        answer.classList.remove('selected');
        answer.setAttribute('aria-pressed', 'false');
      });
    });

    results.forEach((result) => {
      result.style.display = 'none';
      result.classList.remove('is-active');
      result.querySelectorAll('.quiz-result-reveal').forEach((element) => {
        element.classList.remove('quiz-result-reveal');
        element.style.removeProperty('--result-reveal-delay');
      });
      const detailsItems = [...result.querySelectorAll('.result__details-item')];
      detailsItems
        .sort((a, b) => {
          const aIndex = Number(a.className.match(/result__details-item--(\d+)/)?.[1]);
          const bIndex = Number(b.className.match(/result__details-item--(\d+)/)?.[1]);
          return aIndex - bIndex;
        })
        .forEach((item) => item.parentElement.append(item));

      detailsItems.forEach((item) => {
        const value = item.querySelector('.result__details-value');
        const slider = item.querySelector('.result__details-slider');
        if (value) {
          value.textContent = '0%';
        }
        if (slider) {
          slider.style.removeProperty('width');
          slider.style.removeProperty('transition-delay');
        }
      });
    });

    progressSegments.forEach((segment, index) => {
      segment.classList.toggle('current', index === 0);
      segment.classList.remove('past');
    });
    if (progressLabel) {
      progressLabel.textContent = `1 / ${questions.length}`;
    }
    if (backButton) {
      backButton.innerHTML = initialBackButtonContent;
    }

    activateQuestion(questions[0], 0);
  };

  backButton?.addEventListener('click', () => {
    if (isComplete) {
      resetQuiz();
      return;
    }

    if (currentQuestionIndex === 0) {
      return;
    }

    questions[currentQuestionIndex].classList.remove('is-active');
    questions[currentQuestionIndex].style.display = 'none';
    currentQuestionIndex -= 1;
    activateQuestion(questions[currentQuestionIndex], currentQuestionIndex);
  });

  const activateQuestion = (question, index) => {
    question.style.removeProperty('display');
    question.classList.add('is-active');
    question.querySelectorAll('.answer').forEach((answer, answerIndex) => {
      answer.style.setProperty('--answer-index', answerIndex);
    });

    progressSegments.forEach((segment, segmentIndex) => {
      segment.classList.toggle('past', segmentIndex < index);
      segment.classList.toggle('current', segmentIndex === index);
    });
    if (progressLabel) {
      progressLabel.textContent = `${index + 1} / ${questions.length}`;
    }

    const nextButton = question.querySelector('.question__button');
    const selectedAnswer = answers[index];
    nextButton.disabled = !selectedAnswer;

    question.querySelectorAll('.answer').forEach((answer) => {
      answer.setAttribute('role', 'button');
      answer.setAttribute('tabindex', '0');
      const answerIndex = Number(answer.className.match(/answer--(\d+)/)?.[1]);
      const isSelected = selectedAnswer === answerIndex;
      answer.classList.toggle('selected', isSelected);
      answer.setAttribute('aria-pressed', String(isSelected));

      if (!answer.dataset.quizInitialized) {
        answer.addEventListener('click', () => selectAnswer(question, answer, nextButton));
        answer.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            answer.click();
          }
        });
        answer.dataset.quizInitialized = 'true';
      }
    });

    if (!nextButton.dataset.quizInitialized) {
      nextButton.addEventListener('click', () => {
        if (nextButton.disabled) {
          return;
        }

        question.classList.remove('is-active');
        question.style.display = 'none';
        currentQuestionIndex += 1;

        if (currentQuestionIndex < questions.length) {
          activateQuestion(questions[currentQuestionIndex], currentQuestionIndex);
        } else {
          showResult();
        }
      });
      nextButton.dataset.quizInitialized = 'true';
    }
  };

  questions.forEach((question, index) => {
    if (index > 0) {
      question.style.display = 'none';
    }
  });

  if (questions.length) {
    activateQuestion(questions[0], 0);
  }
});

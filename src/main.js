document.documentElement.classList.add('js');

for (const link of document.querySelectorAll('a[target="_blank"]')) {
  link.rel = 'noreferrer noopener';
}

const nav = document.querySelector('[data-nav]');
const toggle = document.querySelector('[data-nav-toggle]');
const mobileLinks = document.querySelectorAll('.nav__mobile a');

if (nav && toggle) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  for (const link of mobileLinks) {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    });
  }
}

for (const servicesLink of document.querySelectorAll('.elementor-item.has-submenu')) {
  servicesLink.addEventListener('click', (event) => {
    event.preventDefault();
  });
}

const heroCarousels = document.querySelectorAll('.elementor-main-swiper');

for (const carousel of heroCarousels) {
  const slides = [...carousel.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)')];
  if (!slides.length) continue;

  let current = Math.max(
    0,
    slides.findIndex((slide) => slide.classList.contains('swiper-slide-active')),
  );

  const renderSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
      slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true');
    });
  };

  renderSlide(current);

  window.setInterval(() => {
    current = (current + 1) % slides.length;
    renderSlide(current);
  }, 4500);
}

const testimonialTrack = document.querySelector('[data-testimonials-track]');

if (testimonialTrack) {
  const originalCards = [...testimonialTrack.querySelectorAll('.testimonial-card')];
  if (originalCards.length) {
    const clones = originalCards.map((card) => card.cloneNode(true));
    testimonialTrack.append(...clones);

    let offset = 0;
    let animationFrame = 0;
    let lastTime = 0;
    let loopWidth = 0;
    let paused = false;

    const measure = () => {
      loopWidth = originalCards.reduce((total, card) => total + card.getBoundingClientRect().width, 0);
      loopWidth += (originalCards.length - 1) * 28;
      offset = Math.min(offset, loopWidth);
      testimonialTrack.style.transform = `translateX(-${offset}px)`;
    };

    const tick = (time) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      if (!paused && loopWidth > 0) {
        offset += delta * 0.045;
        if (offset >= loopWidth) {
          offset = 0;
        }
        testimonialTrack.style.transform = `translateX(-${offset}px)`;
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    testimonialTrack.addEventListener('mouseenter', () => {
      paused = true;
    });

    testimonialTrack.addEventListener('mouseleave', () => {
      paused = false;
    });

    window.addEventListener('resize', measure);
    measure();
    animationFrame = window.requestAnimationFrame(tick);

    window.addEventListener(
      'beforeunload',
      () => {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }
      },
      { once: true },
    );
  }
}

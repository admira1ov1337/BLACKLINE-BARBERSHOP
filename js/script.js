// Карта загружается только после клика пользователя
const loadMapButton = document.getElementById('load-map');
const mapBox = document.getElementById('map');

loadMapButton.addEventListener('click', () => {
  mapBox.innerHTML = `
    <iframe
      src="https://www.openstreetmap.org/export/embed.html?bbox=13.385%2C52.527%2C13.399%2C52.533&layer=mapnik&marker=52.5300%2C13.3920"
      title="Karte: BLACKLINE Barbershop, Torstraße 120, Berlin"
      loading="lazy"></iframe>
  `;
});
// Бургер-меню
const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');

function setMenu(isOpen) {
  nav.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  burger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
}

// Клик по бургеру: открыть, если закрыто, и наоборот
burger.addEventListener('click', () => {
  setMenu(!nav.classList.contains('is-open'));
});

// Клик по любому пункту меню: закрыть меню
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

// Клавиша Escape тоже закрывает меню
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});
// =========================================
// Анимации
// =========================================

// 1. Появление блоков при прокрутке
const revealSelectors = [
  '.section > .eyebrow',
  '.section > h2',
  '.section > p',
  '.price-list li',
  '.team-card',
  '.interior-grid .photo',
  '.gallery-grid .photo',
  'blockquote',
  '.contact-info',
  '.booking-form',
  '.map',
].join(', ');

const revealItems = document.querySelectorAll(revealSelectors);

revealItems.forEach((el) => {
  el.classList.add('reveal');

  // Задержка по порядку среди «братьев», чтобы блоки появлялись каскадом
  const siblings = [...el.parentElement.children].filter((child) =>
    child.classList.contains('reveal')
  );
  const index = Math.min(siblings.indexOf(el), 5);
  el.style.setProperty('--delay', `${index * 0.12}s`);
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // анимация один раз, больше не следим
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);

revealItems.forEach((el) => revealObserver.observe(el));

// 2. Подсветка пункта меню для текущей секции
const navLinks = document.querySelectorAll('.nav li:not(.nav-cta) a');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', isActive);

        if (isActive) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  },
  // Следим за узкой полосой посередине экрана
  { rootMargin: '-45% 0px -50% 0px' }
);

navLinks.forEach((link) => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) spyObserver.observe(target);
});

// Когда мы на hero, ни один пункт не подсвечен
spyObserver.observe(document.getElementById('hero'));
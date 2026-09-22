const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('.modal-gallery img');
const title = lightbox?.querySelector('.modal-copy h2');
const type = lightbox?.querySelector('.modal-type');
const description = lightbox?.querySelector('.modal-description');
const dots = lightbox?.querySelector('.gallery-dots');
let images = [];
let activeImage = 0;

function renderImage() {
  lightboxImage.src = images[activeImage];
  [...dots.children].forEach((dot, index) => dot.classList.toggle('active', index === activeImage));
}

function openProject(project) {
  images = project.dataset.images.split('|');
  activeImage = 0;
  title.textContent = project.dataset.title;
  type.textContent = project.dataset.type.toUpperCase();
  description.textContent = project.dataset.description;
  dots.replaceChildren(...images.map((_, index) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `View image ${index + 1}`);
    dot.addEventListener('click', () => { activeImage = index; renderImage(); });
    return dot;
  }));
  renderImage();
  lightbox.showModal();
}

document.querySelectorAll('[data-images]').forEach((project) => {
  project.addEventListener('click', () => openProject(project));
  project.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(project); }
  });
});

lightbox?.querySelector('.previous').addEventListener('click', () => { activeImage = (activeImage - 1 + images.length) % images.length; renderImage(); });
lightbox?.querySelector('.next').addEventListener('click', () => { activeImage = (activeImage + 1) % images.length; renderImage(); });
lightbox?.querySelector('.modal-close').addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('#main-navigation');
if (menuToggle && mainNavigation) {
  menuToggle.addEventListener('click', () => {
    const open = mainNavigation.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', open);
  });
  mainNavigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mainNavigation.classList.remove('is-open'); menuToggle.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

const sectionLinks = [...document.querySelectorAll('#main-navigation a[href^="#"]')];
const linkedSections = sectionLinks.map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) })).filter((item) => item.section);
if (linkedSections.length) {
  const setActiveLink = (activeLink) => sectionLinks.forEach((link) => link.classList.toggle('active', link === activeLink));
  sectionLinks.forEach((link) => link.addEventListener('click', () => setActiveLink(link)));
  const updateActiveNav = () => {
    const navigationOffset = 130;
    const current = [...linkedSections].reverse().find(({ section }) => section.getBoundingClientRect().top <= navigationOffset) || linkedSections[0];
    setActiveLink(current.link);
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

const showcase = document.querySelector('.hero-showcase');
if (showcase) {
  const showcaseItems = [
    { image: 'assets/WorldPopulation2_4.png', alt: 'Indonesia population density map', title: 'Spatial data, made visible.', modal: ['assets/WorldPopulation2_2.png', 'assets/Cover2.jpg'], type: 'Population analysis', description: 'A national population-density visualisation designed to make broad spatial patterns easy to understand.' },
    { image: 'assets/3d-Model-Jawa.png', alt: '3D terrain model visualisation', title: 'Terrain with real depth.', modal: ['assets/terrain.png', 'assets/Cover2.jpg'], type: 'Terrain modelling', description: 'A three-dimensional terrain visualisation revealing elevation, landform, and coastal context.' },
    { image: 'assets/MVI_2025.png', alt: 'Mangrove vegetation index map', title: 'Environmental change, clarified.', modal: ['assets/MVI_2025.png', 'assets/MVI.png'], type: 'Environmental mapping', description: 'Mangrove and water-body digitisation that helps turn satellite information into usable insight.' }
  ];
  const showcaseImage = showcase.querySelector('img');
  const showcaseTitle = showcase.querySelector('strong');
  const showcaseDots = [...showcase.querySelectorAll('.showcase-dot')];
  let showcaseIndex = 0;
  const renderShowcase = (index) => {
    showcaseIndex = index;
    const item = showcaseItems[index];
    showcaseImage.classList.remove('is-sliding');
    void showcaseImage.offsetWidth;
    showcaseImage.classList.add('is-sliding');
    showcaseImage.src = item.image; showcaseImage.alt = item.alt; showcaseTitle.textContent = item.title;
    showcaseImage.addEventListener('animationend', () => showcaseImage.classList.remove('is-sliding'), { once: true });
    showcaseDots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
  };
  showcaseDots.forEach((dot, index) => dot.addEventListener('click', (event) => { event.stopPropagation(); renderShowcase(index); }));
  showcase.querySelector('.showcase-previous').addEventListener('click', (event) => { event.stopPropagation(); renderShowcase((showcaseIndex - 1 + showcaseItems.length) % showcaseItems.length); });
  showcase.querySelector('.showcase-next').addEventListener('click', (event) => { event.stopPropagation(); renderShowcase((showcaseIndex + 1) % showcaseItems.length); });
}

// Add a .testimonial-card in index.html and it is included automatically.
const testimonialTrack = document.querySelector('.testimonial-track');
const testimonialCards = testimonialTrack ? [...testimonialTrack.querySelectorAll('.testimonial-card')] : [];
let testimonialIndex = 0;
const testimonialPrevious = document.querySelector('.testimonial-previous');
const testimonialNext = document.querySelector('.testimonial-next');

function renderTestimonials(direction = 0) {
  if (!testimonialTrack || !testimonialCards.length) return;

  const total = testimonialCards.length;
  const previousIndex = (testimonialIndex - 1 + total) % total;
  const nextIndex = (testimonialIndex + 1) % total;

  testimonialCards.forEach((card, index) => {
    card.classList.remove('selected', 'testimonial-previous-card', 'testimonial-next-card');
    card.hidden = ![previousIndex, testimonialIndex, nextIndex].includes(index);

    if (index === previousIndex && index !== testimonialIndex) card.classList.add('testimonial-previous-card');
    if (index === testimonialIndex) card.classList.add('selected');
    if (index === nextIndex && index !== testimonialIndex) card.classList.add('testimonial-next-card');
  });

  if (!direction || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  testimonialCards.filter((card) => !card.hidden).forEach((card) => {
    card.animate(
      [
        { opacity: 0, transform: `translateX(${direction * 40}px) scale(.94)` },
        { opacity: card.classList.contains('selected') ? 1 : 0.42, transform: `translateX(0) scale(${card.classList.contains('selected') ? 1 : .94})` }
      ],
      { duration: 340, easing: 'cubic-bezier(.2,.75,.25,1)' }
    );
  });
}

function moveTestimonials(direction) {
  if (testimonialCards.length < 2) return;
  testimonialIndex = (testimonialIndex + direction + testimonialCards.length) % testimonialCards.length;
  renderTestimonials(direction);
}

testimonialPrevious?.addEventListener('click', () => moveTestimonials(-1));
testimonialNext?.addEventListener('click', () => moveTestimonials(1));
renderTestimonials();

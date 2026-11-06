const caseDisplay = document.querySelector('.case-display');
const caseToggle = document.querySelector('#case-toggle');
const caseEvidence = document.querySelector('#case-evidence');
const caseStatus = document.querySelector('#case-status');

function setImageFallback(image) {
  image.hidden = true;
  const fallback = image.previousElementSibling;
  if (fallback?.classList.contains('image-fallback')) fallback.classList.add('is-visible');
}

document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => setImageFallback(image));
});

caseToggle.addEventListener('click', () => {
  const isRevealed = caseDisplay.dataset.revealed === 'true';
  caseDisplay.dataset.revealed = String(!isRevealed);
  caseToggle.textContent = isRevealed ? 'OPEN THE CASE' : 'CLOSE THE CASE';
  caseToggle.setAttribute('aria-expanded', String(!isRevealed));
  caseEvidence.setAttribute('aria-hidden', String(isRevealed));
  caseStatus.textContent = isRevealed ? 'The case is closed.' : 'The case is open. The contents are water.';
});

document.querySelector('a[href="#reveal"]').addEventListener('click', (event) => {
  event.preventDefault();
  if (caseDisplay.dataset.revealed !== 'true') caseToggle.click();
  caseDisplay.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start'
  });
  history.replaceState(null, '', '#reveal');
});

const slides = [...document.querySelectorAll('.slide')];
const track = document.querySelector('#gallery-track');
const slideNumber = document.querySelector('#slide-number');
const galleryStatus = document.querySelector('#gallery-status');
let currentSlide = 0;
let touchStartX = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === currentSlide));
  const readableNumber = String(currentSlide + 1).padStart(2, '0');
  slideNumber.textContent = readableNumber;
  galleryStatus.textContent = `Evidence slide ${currentSlide + 1} of ${slides.length}.`;
}

document.querySelector('#previous-slide').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('#next-slide').addEventListener('click', () => showSlide(currentSlide + 1));

document.querySelector('.gallery__viewport').addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });
document.querySelector('.gallery__viewport').addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 45) showSlide(currentSlide + (distance < 0 ? 1 : -1));
}, { passive: true });
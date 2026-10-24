const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden', 'true');
progress.innerHTML = '<span></span>';
document.body.append(progress);

const toTop = document.createElement('button');
toTop.className = 'to-top';
toTop.type = 'button';
toTop.setAttribute('aria-label', 'Bumalik sa itaas');
toTop.title = 'Bumalik sa itaas';
toTop.textContent = '↑';
document.body.append(toTop);
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const updateReadingControls = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.firstElementChild.style.width = `${percent}%`;
  toTop.classList.toggle('visible', window.scrollY > 500);
};
window.addEventListener('scroll', updateReadingControls, { passive: true });
window.addEventListener('resize', updateReadingControls);
updateReadingControls();

const photos = document.querySelectorAll('.photo img');
if (photos.length && 'HTMLDialogElement' in window) {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Pinalaking larawan');
  dialog.innerHTML = '<figure><img alt=""><figcaption><p></p><button class="lightbox-close" type="button">Isara ✕</button></figcaption></figure>';
  document.body.append(dialog);
  const largeImage = dialog.querySelector('img');
  const caption = dialog.querySelector('figcaption p');
  const closeButton = dialog.querySelector('.lightbox-close');
  let previousFocus;

  const closeLightbox = () => dialog.close();
  closeButton.addEventListener('click', closeLightbox);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeLightbox();
  });
  dialog.addEventListener('close', () => previousFocus?.focus());

  photos.forEach((photo) => {
    const openLightbox = () => {
      previousFocus = photo;
      largeImage.src = photo.currentSrc || photo.src;
      largeImage.alt = photo.alt;
      const card = photo.closest('.card');
      caption.textContent = card?.querySelector('h3')?.textContent || photo.alt;
      dialog.showModal();
      closeButton.focus();
    };
    photo.tabIndex = 0;
    photo.setAttribute('role', 'button');
    photo.setAttribute('aria-label', `Palakihin ang larawan: ${photo.alt}`);
    photo.addEventListener('click', openLightbox);
    photo.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox();
      }
    });
  });
}

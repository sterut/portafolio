// Nota: handleImgError() y handleOptionalImgError() están definidas inline
// en el <head> de index.html (no acá), para que existan antes de que
// cualquier <img onerror> se dispare, sin esperar a que cargue este archivo.

// ===== FADE-IN SUAVE AL HACER SCROLL =====

document.addEventListener('DOMContentLoaded', () => {
  const photos = document.querySelectorAll('.photo');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    photos.forEach((photo) => observer.observe(photo));
  } else {
    photos.forEach((photo) => photo.classList.add('is-visible'));
  }
});

// ===== LIGHTBOX =====

(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');

  let currentGroup = [];
  let currentIndex = 0;

  function getGroupImages(groupEl) {
    return Array.from(groupEl.querySelectorAll('img')).filter(
      (img) => !img.closest('.photo').classList.contains('img-placeholder')
    );
  }

  function openLightbox(groupEl, img) {
    currentGroup = getGroupImages(groupEl);
    currentIndex = currentGroup.indexOf(img);
    if (currentIndex === -1) return;
    showCurrent();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function showCurrent() {
    const img = currentGroup[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function showNext() {
    if (currentGroup.length === 0) return;
    currentIndex = (currentIndex + 1) % currentGroup.length;
    showCurrent();
  }

  function showPrev() {
    if (currentGroup.length === 0) return;
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    showCurrent();
  }

  document.querySelectorAll('.gallery [data-group]').forEach((groupEl) => {
    groupEl.querySelectorAll('.photo').forEach((photoEl) => {
      photoEl.addEventListener('click', () => {
        if (photoEl.classList.contains('img-placeholder')) return;
        const img = photoEl.querySelector('img');
        openLightbox(groupEl, img);
      });
    });
  });

  btnClose.addEventListener('click', closeLightbox);
  btnNext.addEventListener('click', showNext);
  btnPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
})();

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    navToggle.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
    siteNav.classList.toggle('open', !isExpanded);
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      siteNav.classList.remove('open');
    });
  });
}

const yearSlot = document.querySelector('#year');
if (yearSlot) {
  yearSlot.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll('.section-reveal');

if ('IntersectionObserver' in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  let lastScrollY = window.scrollY;
  const minDelta = 6;

  window.addEventListener(
    'scroll',
    () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // Keep header visible at the top and while mobile nav is open.
      if (currentScrollY <= 0 || siteNav?.classList.contains('open')) {
        siteHeader.classList.remove('is-hidden');
        lastScrollY = currentScrollY;
        return;
      }

      if (Math.abs(delta) < minDelta) {
        return;
      }

      if (delta > 0) {
        siteHeader.classList.add('is-hidden');
      } else {
        siteHeader.classList.remove('is-hidden');
      }

      lastScrollY = currentScrollY;
    },
    { passive: true }
  );
}

const galleryImages = Array.from(document.querySelectorAll('.gallery-track img'));

if (galleryImages.length > 0) {
  let frameId = null;

  const updateCenteredGalleryImage = () => {
    const viewportCenterX = window.innerWidth / 2;
    let closestImage = null;
    let minDistance = Number.POSITIVE_INFINITY;

    galleryImages.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const isVisible =
        rect.right > 0 &&
        rect.left < window.innerWidth &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight;

      if (!isVisible) {
        return;
      }

      const imageCenterX = rect.left + rect.width / 2;
      const distanceToCenter = Math.abs(imageCenterX - viewportCenterX);

      if (distanceToCenter < minDistance) {
        minDistance = distanceToCenter;
        closestImage = img;
      }
    });

    galleryImages.forEach((img) => {
      img.classList.toggle('is-center', img === closestImage);
    });

    frameId = window.requestAnimationFrame(updateCenteredGalleryImage);
  };

  const startGalleryTracking = () => {
    if (frameId !== null) {
      return;
    }

    frameId = window.requestAnimationFrame(updateCenteredGalleryImage);
  };

  const stopGalleryTracking = () => {
    if (frameId === null) {
      return;
    }

    window.cancelAnimationFrame(frameId);
    frameId = null;
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopGalleryTracking();
      return;
    }

    startGalleryTracking();
  });

  startGalleryTracking();
}
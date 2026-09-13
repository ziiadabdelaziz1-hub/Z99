/**
 * Z99 CREATIVE STUDIO - Core Interactive Engine
 * Domain: z99creativestudio.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeroCanvas();
  initNavbar();
  initMobileDrawer();
  initCarousel();
  initProjectFilter();
  initVideoModal();
  initContactForm();
  initMoodboardLightbox();
  initCustomCursor();
  initCustomSelect();
  initIframeCursorOverlay();
  initCategoryPillsScroll();
});

/* ==========================================================================
   0. PRELOADER
   ========================================================================== */
function initPreloader() {
  // Inject preloader HTML
  const el = document.createElement('div');
  el.id = 'z99-preloader';
  el.innerHTML = `
    <div class="preloader-logo">
      <img src="assets/z99-logo.png" alt="Z99" class="preloader-logo-img">
      <span class="preloader-logo-tagline">Creative Studio</span>
    </div>
    <div class="preloader-bar-track">
      <div class="preloader-bar-fill"></div>
    </div>
  `;
  // Insert as first child of body (or document.documentElement if body not ready)
  const target = document.body || document.documentElement;
  target.insertBefore(el, target.firstChild);

  const fill    = el.querySelector('.preloader-bar-fill');

  let progress   = 0;
  const MIN_MS   = 1800; // always show for at least 1.8s
  const start    = performance.now();
  let pageLoaded = false;

  // Tick progress forward
  function tick() {
    const elapsed  = performance.now() - start;
    const timePct  = Math.min((elapsed / MIN_MS) * 100, 97);
    // Drift toward time-based progress or 97, whichever is higher when page loads
    const target   = pageLoaded ? 100 : timePct;
    progress += (target - progress) * 0.08;
    if (progress > 99.5) progress = 100;

    const p = Math.round(progress);
    fill.style.width = p + '%';

    if (p < 100) {
      requestAnimationFrame(tick);
    } else {
      // Small pause at 100 then slide away
      setTimeout(dismiss, 200);
    }
  }

  function dismiss() {
    el.classList.add('exit');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
    // Restore scroll if we locked it
    document.body.style.overflow = '';
  }

  // Lock scroll during preloader
  document.body.style.overflow = 'hidden';

  // Start ticking immediately
  requestAnimationFrame(tick);

  // Flag when page is fully loaded
  window.addEventListener('load', () => {
    pageLoaded = true;
  }, { once: true });
}

/* ==========================================================================
   1. HERO AMBIENT CANVAS (Cyber Laser & Projection Mapping Mesh)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Create geometric nodes for 3D mapping illusion
  const nodeCount = Math.min(width > 768 ? 65 : 30, 80);
  for (let i = 0; i < nodeCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.4 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Subtle dark gradient background
    const bgGrad = ctx.createRadialGradient(
      width / 2, height / 2, 50,
      width / 2, height / 2, width * 0.8
    );
    bgGrad.addColorStop(0, 'rgba(10, 15, 5, 0.4)');
    bgGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Interaction with mouse
      if (mouse.x !== null) {
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215, 255, 63, ${p.baseAlpha})`;
      ctx.fill();

      // Connect lines (Projection Mapping Triangular Poly Net)
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          let lineAlpha = (1 - dist / 130) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(215, 255, 63, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. NAVBAR & SCROLL INTERACTION
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Active section spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   3. MOBILE HAMBURGER DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const hamburger = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !drawer || !backdrop) return;

  function toggleMenu() {
    hamburger.classList.toggle('active');
    drawer.classList.toggle('open');
    backdrop.classList.toggle('active');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawerCta = document.getElementById('mobileDrawerCta');

  hamburger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMenu);
  if (mobileDrawerCta) mobileDrawerCta.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   4. VISUAL SHOWCASE CAROUSEL
   ========================================================================== */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;
  let autoplayTimer;

  // Create dot indicators
  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.carousel-dot');

  function updateSlide() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function goToSlide(idx) {
    currentIndex = idx;
    updateSlide();
    resetAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSlide();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateSlide();
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  // Touch Swipe
  let startX = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  track.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    isSwiping = false;
    resetAutoplay();
  });

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Keyboard navigation for carousel
  document.addEventListener('keydown', (e) => {
    const isModalOpen = document.querySelector('.modal-backdrop.open') || document.querySelector('.lightbox-modal.open');
    if (isModalOpen) return;

    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoplay();
    }
  });

  startAutoplay();
}

/* ==========================================================================
   5. PROJECTS FILTERING (Bento Grid)
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.bento-card');

  if (filterBtns.length === 0 || cards.length === 0) return;

  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isAlreadyActive = btn.classList.contains('active');
      const filter = btn.getAttribute('data-filter');

      // If clicking already active 'all' button, maintain all active
      if (isAlreadyActive && filter === 'all') {
        return;
      }

      // If deselecting a specific active category, revert back to all
      if (isAlreadyActive) {
        btn.classList.remove('active');
        if (allBtn) allBtn.classList.add('active');
        cards.forEach(card => {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        });
        return;
      }

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
        }
      });
    });
  });
}

function initCategoryPillsScroll() {
  const container = document.querySelector('.case-category-pills');
  const activePill = document.querySelector('.case-category-pills .case-cat-pill.active');
  if (container && activePill) {
    setTimeout(() => {
      const pillOffset = activePill.offsetLeft - (container.clientWidth / 2) + (activePill.clientWidth / 2);
      container.scrollTo({ left: Math.max(0, pillOffset), behavior: 'smooth' });
    }, 120);
  }
}

/* ==========================================================================
   6. VIDEO MODAL LIGHTBOX (Showreel Player)
   ========================================================================== */
function initVideoModal() {
  const openTriggers = document.querySelectorAll('[data-video-trigger]');
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('closeVideoModal');
  const frameContainer = document.getElementById('videoFrameContainer');

  if (!modal || !frameContainer) return;

  function openModal() {
    frameContainer.innerHTML = `
      <iframe width="100%" height="100%" src="https://www.youtube.com/embed/6-HUUaqAr_Q?autoplay=1&rel=0&modestbranding=1" title="Z99 Creative Studio Showreel" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;"></iframe>
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    frameContainer.innerHTML = '';
    document.body.style.overflow = '';
  }

  openTriggers.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}



/* ==========================================================================
   8. CONTACT FORM & TOAST
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('z9ContactForm');
  const toast = document.getElementById('toastNotice');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const service = document.getElementById('formService').value;
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email) {
      showToast('Please fill in required fields');
      return;
    }

    // Compose prefilled WhatsApp message for direct booking
    const waText = encodeURIComponent(
      `Hello Z99 Studio,\nMy name is ${name} (${email}).\nI am inquiring about: ${service.toUpperCase()}.\nProject details: ${message || 'Looking for project inquiry.'}`
    );
    const waUrl = `https://wa.me/201206049448?text=${waText}`;

    // Success feedback
    showToast(`Connecting to WhatsApp with your project inquiry, ${name}...`);
    
    // Open WhatsApp in a new tab
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 400);

    form.reset();
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

/* ==========================================================================
   9. MOODBOARD LIGHTBOX
   ========================================================================== */
function initMoodboardLightbox() {
  const items = document.querySelectorAll('.moodboard-item');
  if (items.length === 0) return;

  // Create or get lightbox modal
  let lightbox = document.getElementById('moodboardLightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'moodboardLightbox';
    lightbox.className = 'lightbox-modal';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    document.body.appendChild(lightbox);
  }

  // Always refresh markup to ensure navigation buttons exist
  lightbox.innerHTML = `
    <button class="lightbox-close-btn" id="closeLightboxBtn" aria-label="Close Lightbox">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <button class="lightbox-nav-btn lightbox-prev-btn" id="prevLightboxBtn" aria-label="Previous Image">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <button class="lightbox-nav-btn lightbox-next-btn" id="nextLightboxBtn" aria-label="Next Image">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
    <div class="lightbox-content">
      <img src="" alt="Moodboard Full View" class="lightbox-img" id="lightboxImg">
      <div class="lightbox-caption" id="lightboxCaption"></div>
    </div>
  `;

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightboxBtn');
  const prevBtn = document.getElementById('prevLightboxBtn');
  const nextBtn = document.getElementById('nextLightboxBtn');

  // Collect images and data
  const images = [];
  items.forEach((item, idx) => {
    const img = item.querySelector('img');
    const captionElem = item.querySelector('.moodboard-caption span') || item.querySelector('.moodboard-item-title');
    if (img) {
      images.push({
        src: img.src,
        caption: captionElem ? captionElem.textContent.trim() : (img.alt || '')
      });
      item.dataset.lightboxIndex = idx;
    }
  });

  if (images.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  let currentIndex = 0;

  function updateImage(index) {
    if (images.length === 0) return;
    currentIndex = (index + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxCaption.textContent = images[currentIndex].caption || '';
  }

  function openLightbox(index) {
    updateImage(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function showNext() {
    updateImage(currentIndex + 1);
  }

  function showPrev() {
    updateImage(currentIndex - 1);
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.lightboxIndex, 10);
      if (!isNaN(idx)) {
        openLightbox(idx);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrev();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNext();
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showNext();
    }
  });
}

/* ==========================================================================
   9. BESPOKE STUDIO CURSOR (Fluid Inertia & Micro-Interactions)
   ========================================================================== */
function initCustomCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (document.getElementById('cursorDot')) return;

  const dot = document.createElement('div');
  dot.id = 'cursorDot';
  dot.className = 'cursor-dot';

  const ring = document.createElement('div');
  ring.id = 'cursorRing';
  ring.className = 'cursor-ring';

  const label = document.createElement('span');
  label.id = 'cursorLabel';
  label.className = 'cursor-label';
  label.textContent = 'VIEW';
  ring.appendChild(label);

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isVisible = false;
  let isClicked = false;
  let rafId = null;

  function render() {
    if (isVisible) {
      const lerp = 0.18;
      ringX += (mouseX - ringX) * lerp;
      ringY += (mouseY - ringY) * lerp;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${isClicked ? 'scale(0.85)' : ''}`;
    }
    rafId = requestAnimationFrame(render);
  }
  rafId = requestAnimationFrame(render);

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      ringX = mouseX;
      ringY = mouseY;
      dot.classList.add('active');
      ring.classList.add('active');
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    dot.classList.remove('active');
    ring.classList.remove('active');
  });

  document.addEventListener('mouseenter', () => {
    isVisible = true;
    dot.classList.add('active');
    ring.classList.add('active');
  });

  window.addEventListener('mousedown', () => {
    isClicked = true;
    ring.classList.add('is-clicked');
    dot.classList.add('is-clicked');
  });

  window.addEventListener('mouseup', () => {
    isClicked = false;
    ring.classList.remove('is-clicked');
    dot.classList.remove('is-clicked');
  });

  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target) return;

    // 1. Media & Project Cards
    const mediaTarget = target.closest('.bento-card, .moodboard-item, .cinema-video-wrapper, .media-zoomable, .card-media-wrapper, .about-visual-frame');
    if (mediaTarget) {
      if (mediaTarget.closest('.moodboard-grid') || mediaTarget.classList.contains('media-zoomable')) {
        label.textContent = 'ZOOM';
      } else if (mediaTarget.classList.contains('cinema-video-wrapper')) {
        label.textContent = 'PLAY';
      } else {
        label.textContent = 'VIEW';
      }
      ring.classList.add('is-media');
      dot.classList.add('is-media');
      return;
    }

    // 2. Form Inputs
    const inputTarget = target.closest('input, textarea, select');
    if (inputTarget) {
      ring.classList.add('is-input');
      dot.classList.add('is-input');
      return;
    }

    // 3. Interactive Buttons, Links & Navigation Pills
    const linkTarget = target.closest('a, button, .btn, .case-cat-pill, .carousel-btn, .filter-btn, [role="button"], label, .lightbox-arrow, .lightbox-close, .nav-link, .brand-logo-link');
    if (linkTarget) {
      ring.classList.add('is-hovered');
      dot.classList.add('is-hovered');
      return;
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (!target) return;

    const mediaTarget = target.closest('.bento-card, .moodboard-item, .cinema-video-wrapper, .media-zoomable, .card-media-wrapper, .about-visual-frame');
    if (mediaTarget) {
      ring.classList.remove('is-media');
      dot.classList.remove('is-media');
    }

    const inputTarget = target.closest('input, textarea, select');
    if (inputTarget) {
      ring.classList.remove('is-input');
      dot.classList.remove('is-input');
    }

    const linkTarget = target.closest('a, button, .btn, .case-cat-pill, .carousel-btn, .filter-btn, [role="button"], label, .lightbox-arrow, .lightbox-close, .nav-link, .brand-logo-link');
    if (linkTarget) {
      ring.classList.remove('is-hovered');
      dot.classList.remove('is-hovered');
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(render);
    }
  });
}

/* ==========================================================================
   10. CUSTOM BRAND SELECT DROPDOWN (Acid Lime Highlight)
   ========================================================================== */
function initCustomSelect() {
  const selects = document.querySelectorAll('.form-select');
  selects.forEach((select) => {
    if (select.dataset.customized === 'true') return;
    select.dataset.customized = 'true';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';

    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    
    const selectedOption = select.options[select.selectedIndex] || select.options[0];
    const triggerText = document.createElement('span');
    triggerText.className = 'custom-select-text';
    triggerText.textContent = selectedOption ? selectedOption.textContent : '';

    const arrow = document.createElement('div');
    arrow.className = 'custom-select-arrow';
    arrow.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

    trigger.appendChild(triggerText);
    trigger.appendChild(arrow);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'custom-select-options';

    Array.from(select.options).forEach((opt, idx) => {
      const optionElem = document.createElement('div');
      optionElem.className = 'custom-option';
      if (idx === select.selectedIndex) {
        optionElem.classList.add('selected');
      }
      optionElem.textContent = opt.textContent;
      optionElem.dataset.value = opt.value;

      optionElem.addEventListener('click', (e) => {
        e.stopPropagation();
        select.value = opt.value;
        triggerText.textContent = opt.textContent;

        optionsContainer.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
        optionElem.classList.add('selected');

        wrapper.classList.remove('open');
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      optionsContainer.appendChild(optionElem);
    });

    select.style.display = 'none';

    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    wrapper.appendChild(trigger);
    wrapper.appendChild(optionsContainer);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
        if (w !== wrapper) w.classList.remove('open');
      });
      wrapper.classList.toggle('open');
    });

    const form = select.closest('form');
    if (form) {
      form.addEventListener('reset', () => {
        setTimeout(() => {
          const resetOpt = select.options[select.selectedIndex] || select.options[0];
          if (resetOpt) {
            triggerText.textContent = resetOpt.textContent;
            optionsContainer.querySelectorAll('.custom-option').forEach((el, idx) => {
              el.classList.toggle('selected', idx === select.selectedIndex);
            });
          }
        }, 10);
      });
    }
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
      w.classList.remove('open');
    });
  });
}

/* ==========================================================================
   11. IFRAME CURSOR OVERLAY (keeps custom cursor alive over YouTube iframes)
   ========================================================================== */
function initIframeCursorOverlay() {
  // Only needed on devices where the custom cursor is active
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  function attachOverlay(wrapper) {
    if (wrapper.querySelector('.iframe-cursor-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'iframe-cursor-overlay';
    wrapper.appendChild(overlay);

    // On click: lift overlay so YouTube receives the click, then restore on leave
    overlay.addEventListener('click', () => {
      overlay.classList.add('clicked');
    });

    // Restore overlay when mouse leaves the wrapper
    wrapper.addEventListener('mouseleave', () => {
      overlay.classList.remove('clicked');
    });
  }

  // Attach to all existing wrappers
  document.querySelectorAll('.cinema-video-wrapper').forEach(attachOverlay);

  // Also watch for dynamically injected wrappers (e.g. modal video)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.classList && node.classList.contains('cinema-video-wrapper')) {
          attachOverlay(node);
        }
        node.querySelectorAll && node.querySelectorAll('.cinema-video-wrapper').forEach(attachOverlay);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

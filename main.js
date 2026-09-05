/**
 * Z9 CREATIVE STUDIO - Core Interactive Engine
 * Domain: z9creativestudio.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initNavbar();
  initMobileDrawer();
  initCarousel();
  initProjectFilter();
  initVideoModal();
  initProjectModal();
  initContactForm();
});

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

  hamburger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
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

  startAutoplay();
}

/* ==========================================================================
   5. PROJECTS FILTERING (Bento Grid)
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.bento-card');

  if (filterBtns.length === 0 || cards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

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

/* ==========================================================================
   6. VIDEO MODAL LIGHTBOX (Showreel Player)
   ========================================================================== */
function initVideoModal() {
  const openTriggers = document.querySelectorAll('[data-video-trigger]');
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('closeVideoModal');
  const frameContainer = document.getElementById('videoFrameContainer');

  if (!modal || !frameContainer) return;

  // Official Msquared showreel YouTube video ID: QvrO3Alz96U
  const videoSrc = "https://www.youtube.com/embed/QvrO3Alz96U?autoplay=1&rel=0&modestbranding=1";

  function openModal() {
    frameContainer.innerHTML = `<iframe src="${videoSrc}" title="Z9 Creative Studio Showreel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
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
   7. PROJECT DETAILS MODAL
   ========================================================================== */
const projectData = {
  weddings: {
    title: "Luxury Wedding Architectural Mapping",
    category: "Weddings & Celebrations",
    image: "assets/wedding.jpg",
    specs: ["Ballroom 360° Mapping", "Custom Visual Storytelling", "Cake Projection Sync", "Dynamic Lighting Setup"],
    desc: "Transforming high-end wedding venues into magical, dynamic dreamscapes. From digital cathedral arches with glowing floral animations to synchronized first-dance light shows, Z9 turns wedding architecture into pure poetry."
  },
  concerts: {
    title: "Stadium Concert & Festival Visuals",
    category: "Concerts & Music Festivals",
    image: "assets/concert.jpg",
    specs: ["Gigantic Kinetic LED Arrays", "Real-Time Audio Reactive VJ", "Laser Beam Integration", "Ultra-Low Latency Staging"],
    desc: "High-voltage visual engineering designed for maximum crowd impact. We build massive multi-layered geometric LED screens, synchronized strobe choreography, and custom 3D motion loops that electrify arena audiences."
  },
  keynote: {
    title: "Anamorphic 3D Corporate Keynotes",
    category: "Brand Events & Conferences",
    image: "assets/keynote.jpg",
    specs: ["Curved 3D Anamorphic Display", "Holographic Product Reveals", "Keynote Staging Direction", "Interactive Audience LED"],
    desc: "Empowering visionary global brands to deliver show-stopping product unveilings. Featuring hyperrealistic 3D illusions where products appear to float out of the screen toward the audience."
  },
  facade: {
    title: "Monumental 3D Building Facade Mapping",
    category: "3D Projection Mapping & Holograms",
    image: "assets/facade.jpg",
    specs: ["Multi-Projector 40,000+ Lumens Sync", "3D LiDAR Laser Scanned Facades", "Illusionary Architectural Deconstruction", "Outdoor Waterproof Rigs"],
    desc: "Taking monumental public buildings and turning historic facades into living optical illusions. Combining 3D architectural geometry with cinematic audio scores for national celebrations and mega festivals."
  }
};

function initProjectModal() {
  const triggers = document.querySelectorAll('[data-project-id]');
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeProjectModal');

  if (!modal) return;

  const modalImg = document.getElementById('projectModalImg');
  const modalCategory = document.getElementById('projectModalCategory');
  const modalTitle = document.getElementById('projectModalTitle');
  const modalDesc = document.getElementById('projectModalDesc');
  const modalSpecs = document.getElementById('projectModalSpecs');

  function openProject(id) {
    const data = projectData[id];
    if (!data) return;

    modalImg.src = data.image;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    modalSpecs.innerHTML = '';
    data.specs.forEach(spec => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.gap = '8px';
      li.style.fontSize = '0.88rem';
      li.style.color = '#F5F5F2';
      li.innerHTML = `<span style="color:#D7FF3F;">✦</span> ${spec}`;
      modalSpecs.appendChild(li);
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProject() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggers.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    const id = t.getAttribute('data-project-id');
    openProject(id);
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeProject);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProject();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeProject();
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

    if (!name || !email) {
      showToast('Please fill in required fields');
      return;
    }

    // Success feedback
    showToast(`Thank you, ${name}! Your inquiry has been dispatched to Z9 Studio.`);
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

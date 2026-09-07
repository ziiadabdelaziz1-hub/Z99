/**
 * Z99 CREATIVE STUDIO - Core Interactive Engine
 * Domain: z99creativestudio.com
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

  // Z99 Official 2026 Showreel YouTube Video ID: 6-HUUaqAr_Q
  const videoSrc = "https://www.youtube.com/embed/6-HUUaqAr_Q?autoplay=1&rel=0&modestbranding=1";

  function openModal() {
    frameContainer.innerHTML = `<iframe src="${videoSrc}" title="Z99 Creative Studio Showreel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
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
  abdeen: {
    title: "Abdeen Palace: Royal Bridal Entrance 3D Mapping",
    category: "Monumental Architectural Mapping",
    image: "assets/abdeen-palace.jpg",
    specs: ["Historic Palace Facade Scan", "Sub-Millimeter Column & Window Calibration", "Live Orchestral Music Choreography", "Custom Computational 3D Illusions"],
    desc: "A monumental royal bridal entrance mapped onto the historic neoclassical facade of Abdeen Palace in Cairo. Custom computational 3D visual storytelling synchronized with live orchestral music, turning historic palace stone into a living, breathing spectacle."
  },
  byd: {
    title: "BYD Global: Next-Gen EV Reveal & Anamorphic Visuals",
    category: "Automotive & Brand Activations",
    image: "assets/byd-hero.jpg",
    specs: ["Anamorphic 3D LED Screen Content", "Volumetric Vehicle Reveal Effects", "Photorealistic CGI Pre-Visualization", "High-Impact Kinetic Motion Design"],
    desc: "Next-generation electric vehicle reveal show engineered for BYD. High-impact 3D anamorphic depth illusions, photorealistic vehicle CGI simulations, and synchronized lighting choreography designed to dominate the room and social feeds."
  },
  fossil: {
    title: "Fossil: 3D Timepiece CGI Simulation & Launch Visuals",
    category: "Product CGI & Motion Design",
    image: "assets/fossil-hero.jpg",
    specs: ["Sub-Millimeter Metallic Texturing", "Macro Lighting & Material Physics", "Cinematic Commercial Animation", "Ultra-High Definition Screen Playback"],
    desc: "High-fidelity 3D timepiece simulation and cinematic commercial motion design created for Fossil. Featuring sub-millimeter metallic texturing, dynamic lighting reflections, and seamless looping visual effects."
  },
  concerts: {
    title: "Stadium Concerts & Live Festival Stages",
    category: "Concerts & Music Festivals",
    image: "assets/concert-real.jpg",
    specs: ["Pulsing Festival Stage Displays", "Audio-Reactive Real-Time Loops", "High-Lumen Projector Rigs", "Crowd Euphoria Visual Direction"],
    desc: "Pulsing festival stage visuals, synchronized projection mapping, and real-time audio-reactive visual loops engineered to amplify crowd euphoria across major concerts and music festivals."
  },
  weddings: {
    title: "Royal Weddings & Immersive Ballroom Transformations",
    category: "Weddings & Private Celebrations",
    image: "assets/wedding-luxury.jpg",
    specs: ["360° Ballroom Venue Mapping", "Bridal Entrance Projection Sequences", "Bespoke Cake Projection Mapping", "Dreamlike Architectural Table-Scapes"],
    desc: "From complete ballroom transformations to bridal entrance visual journeys, cake mapping, and dreamlike table-scape visuals — we turn physical venues into enchanting, personalized environments that bring the couple's love story to life."
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
    showToast(`Thank you, ${name}! Your inquiry has been sent to z99creativestudio@gmail.com.`);
    
    // Optionally open WhatsApp in a new tab to complete booking
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);

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

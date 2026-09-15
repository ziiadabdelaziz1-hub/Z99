/**
 * Z99 CREATIVE STUDIO - Interactive Handover Presentation Engine
 * Complies with strict CSP (A+ Rating) - No inline scripts or handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slideNumber = document.getElementById('slideNumber');
  const progressBar = document.getElementById('progressBar');
  const indexDrawer = document.getElementById('indexDrawer');
  const tocBtn = document.getElementById('tocBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const printBtn = document.getElementById('printBtn');
  const indexItems = document.querySelectorAll('.index-item');

  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentSlide = index;

    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });

    indexItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    if (slideNumber) {
      slideNumber.textContent = `${String(index + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    }
    if (progressBar) {
      progressBar.style.width = `${((index + 1) / totalSlides) * 100}%`;
    }

    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === totalSlides - 1;

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function goToSlide(index) {
    updateSlide(index);
    if (indexDrawer) indexDrawer.classList.remove('open');
  }

  // Attach event listeners to all table of contents items
  indexItems.forEach((item, i) => {
    item.addEventListener('click', () => goToSlide(i));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) updateSlide(currentSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) updateSlide(currentSlide + 1);
    });
  }

  if (tocBtn) {
    tocBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (indexDrawer) indexDrawer.classList.toggle('open');
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn('Fullscreen request failed:', err);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
      if (currentSlide < totalSlides - 1) {
        e.preventDefault();
        updateSlide(currentSlide + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentSlide > 0) {
        e.preventDefault();
        updateSlide(currentSlide - 1);
      }
    } else if (e.key === 'Escape') {
      if (indexDrawer) indexDrawer.classList.remove('open');
    }
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (indexDrawer && !indexDrawer.contains(e.target) && e.target !== tocBtn) {
      indexDrawer.classList.remove('open');
    }
  });

  updateSlide(0);
});

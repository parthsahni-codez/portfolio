document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const dots = document.querySelectorAll('.dot');
  const testimonials = document.querySelectorAll('.testimonial-card');
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.querySelector('.modal-close');
  const bookingForm = document.getElementById('booking-form');
  const bgCanvas = document.getElementById('bg-canvas');

  // Smooth scroll for nav and in-page anchors
  const smoothScroll = (targetId) => {
    const target = document.querySelector(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScroll(href);
      }
    });
  });

  // Update active nav link on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((section) => observer.observe(section));

  // Services strip tooltip
  const stripPills = document.querySelectorAll('.strip-pill');
  const stripTooltip = document.getElementById('strip-tooltip');
  const stripContainer = document.querySelector('.services-strip');
  
  if (stripTooltip && stripContainer && stripPills.length) {
    stripPills.forEach((pill) => {
      pill.addEventListener('mouseenter', () => {
        const info = pill.dataset.info;
        if (!info) return;

        stripTooltip.textContent = info;
        stripTooltip.classList.add('visible');

        // Position tooltip just below the strip, aligned to the hovered pill
        const pillRect = pill.getBoundingClientRect();
        const stripRect = stripContainer.getBoundingClientRect();
        const tooltipRect = stripTooltip.getBoundingClientRect();

        let left = pillRect.left + pillRect.width / 2 - tooltipRect.width / 2;
        const top = stripRect.bottom + window.scrollY + 10; // between strip and About image

        const maxLeft = window.innerWidth - tooltipRect.width - 20;
        if (left < 20) left = 20;
        if (left > maxLeft) left = maxLeft;

        stripTooltip.style.left = `${left}px`;
        stripTooltip.style.top = `${top}px`;
      });

      pill.addEventListener('mouseleave', () => {
        stripTooltip.classList.remove('visible');
      });
    });
  }

  // Portfolio filtering
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Portfolio modal
  const openModal = (card) => {
    modalTitle.textContent = card.dataset.title || 'Project Title';
    modalDesc.textContent = card.dataset.description || 'Project description goes here.';
    const link = modal.querySelector('a');
    link.href = card.dataset.link || '#';
    modal.classList.add('show');
  };

  projectCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // avoid duplicate trigger when clicking button
      if (e.target.closest('.project-arrow')) {
        e.preventDefault();
      }
      openModal(card);
    });
    const arrow = card.querySelector('.project-arrow');
    arrow.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(card);
    });
  });

  const closeModal = () => modal.classList.remove('show');
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Testimonials slider
  const setActiveTestimonials = (groupIndex) => {
    testimonials.forEach((card) => card.classList.add('hidden'));
    dots.forEach((dot) => dot.classList.remove('active'));
    const start = groupIndex * 2;
    const indices = [start, start + 1];
    indices.forEach((i) => {
      const card = document.querySelector(`.testimonial-card[data-index="${i}"]`);
      if (card) {
        card.classList.remove('hidden');
        // trigger reflow to restart animation
        void card.offsetWidth;
        card.classList.add('visible');
      }
    });
    testimonials.forEach((card) => {
      if (card.classList.contains('hidden')) card.classList.remove('visible');
    });
    const activeDot = document.querySelector(`.dot[data-index="${groupIndex}"]`);
    if (activeDot) activeDot.classList.add('active');
  };

  if (dots.length) {
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        setActiveTestimonials(Number(dot.dataset.index));
      });
    });
    setActiveTestimonials(0);
  }

  // Simple hero load animation
  document.body.classList.add('page-loaded');

  // Booking form -> Google Calendar create link
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(bookingForm);
      const name = formData.get('name') || 'Meeting';
      const email = formData.get('email') || '';
      const date = formData.get('date');
      const time = formData.get('time');
      const duration = parseInt(formData.get('duration') || '30', 10);
      const type = formData.get('type') || 'Meeting';
      const notes = formData.get('notes') || '';

      if (!date || !time) return;

      // Build start/end in UTC for Google Calendar URL
      const startLocal = new Date(`${date}T${time}`);
      const endLocal = new Date(startLocal.getTime() + duration * 60000);
      const formatForCalendar = (d) =>
        d
          .toISOString()
          .replace(/[-:]/g, '')
          .split('.')[0] + 'Z';

      const startStr = formatForCalendar(startLocal);
      const endStr = formatForCalendar(endLocal);

      const title = encodeURIComponent(`${type} with Parth – ${name}`);
      const details = encodeURIComponent(
        `Requested by: ${name} (${email})\nType: ${type}\nNotes: ${notes}`
      );
      const location = encodeURIComponent('Google Meet (set a link)');

      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startStr}/${endStr}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  // Animated background (soft shooting stars)
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let stars = [];
    const starCount = 90;
    const dpr = window.devicePixelRatio || 1;
    let w, h;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      bgCanvas.width = w * dpr;
      bgCanvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    const resetStar = (star) => {
      star.x = Math.random() * w;
      star.y = Math.random() * h * 0.8;
      star.size = Math.random() * 1.2 + 0.4;
      star.speed = Math.random() * 0.6 + 0.2;
      star.alpha = Math.random() * 0.6 + 0.2;
      star.trail = Math.random() > 0.9;
    };

    const initStars = () => {
      stars = new Array(starCount).fill(null).map(() => {
        const star = {};
        resetStar(star);
        return star;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      stars.forEach((star) => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 6);
        gradient.addColorStop(0, 'rgba(165,91,255,0.9)');
        gradient.addColorStop(1, 'rgba(165,91,255,0)');
        ctx.fillStyle = gradient;
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();

        if (star.trail) {
          ctx.strokeStyle = 'rgba(165,91,255,0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x - star.speed * 22, star.y + star.speed * 14);
          ctx.stroke();
        }

        star.x += star.speed * 1.5;
        star.y -= star.speed * 0.6;
        star.alpha -= 0.0025;
        if (star.alpha <= 0 || star.x > w + 10 || star.y < -10) resetStar(star);
      });
      requestAnimationFrame(draw);
    };

    resize();
    initStars();
    draw();
    window.addEventListener('resize', () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
      initStars();
    });
  }
});


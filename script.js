document.addEventListener('DOMContentLoaded', () => {
  // ======================
  // Navigation & Scroll
  // ======================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Update active nav link on scroll
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-80px 0px -60% 0px'
  };
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOptions);
  
  sections.forEach(section => navObserver.observe(section));
  
  // ======================
  // Scroll Animations
  // ======================
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  animateElements.forEach(el => scrollObserver.observe(el));
  
  // ======================
  // Skill Progress Bars Animation
  // ======================
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => skillObserver.observe(bar));
  
  // ======================
  // Contact Form Handling
  // ======================
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    // Configure your Formspree form ID here (create a free form at https://formspree.io)
    // Example: const FORMSPREE_FORM_ID = 'mknqzqdo';
    const FORMSPREE_FORM_ID = 'YOUR_FORMSPREE_FORM_ID';

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path>
        </svg>
        Sending...
      `;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Helper to show feedback and reset button
      const showResult = (success, message) => {
        if (success) {
          submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ${message}
          `;
          submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          contactForm.reset();
        } else {
          submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            ${message}
          `;
          submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3500);
      };

      try {
        if (FORMSPREE_FORM_ID && FORMSPREE_FORM_ID !== 'YOUR_FORMSPREE_FORM_ID') {
          // Send to Formspree (recommended)
          const url = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: data.name || '',
              email: data.email || '',
              subject: data.subject || 'Website Contact',
              message: data.message || ''
            })
          });

          if (res.ok) {
            showResult(true, 'Message Sent!');
          } else {
            // If Formspree returns an error, fallback to mailto
            console.warn('Formspree response not OK', res.status);
            showResult(false, 'Failed to send via Formspree');
          }
        } else {
          // No Formspree configured — open Gmail web compose to avoid opening Outlook desktop
          const subject = encodeURIComponent(data.subject || 'Website Contact');
          const body = encodeURIComponent(`Name: ${data.name || ''}\nEmail: ${data.email || ''}\n\n${data.message || ''}`);
          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=work.parthsahni@gmail.com&su=${subject}&body=${body}`;
          // Open Gmail compose in a new tab (user must be signed in)
          window.open(gmailUrl, '_blank');
          showResult(true, 'Opened Gmail compose');
        }
      } catch (err) {
        console.error('Contact form error:', err);
        showResult(false, 'Failed to Send');
      }
    });
  }
  
  // ======================
  // Animated Background Canvas (Disabled on mobile for performance)
  // ======================
  const bgCanvas = document.getElementById('bg-canvas');
  const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (bgCanvas && !isMobile) {
    const ctx = bgCanvas.getContext('2d');
    let particles = [];
    const particleCount = 40; // Reduced for better performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
    let w, h;
    
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      bgCanvas.width = w * dpr;
      bgCanvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
          this.reset();
        }
      }
      
      draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 4
        );
        gradient.addColorStop(0, `rgba(139, 92, 246, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    const connectParticles = () => {
      // Optimized: only connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = dx * dx + dy * dy; // Use squared distance to avoid sqrt
          
          if (distance < 22500) { // 150^2
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - Math.sqrt(distance) / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      connectParticles();
      
      requestAnimationFrame(animate);
    };
    
    resize();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
      initParticles();
    });
  }
  
  // ======================
  // Parallax Effect on Hero (Disabled on mobile for performance)
  // ======================
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const heroLeft = document.querySelector('.hero-left');
  const heroRight = document.querySelector('.hero-right');
  
  if (hero && heroContent && heroLeft && heroRight && !isMobile) {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const heroHeight = hero.offsetHeight;
          
          if (scrolled <= heroHeight) {
            // Subtle parallax only on the right side (photo)
            const rate = scrolled * 0.2; // Reduced for smoother performance
            heroRight.style.transform = `translateY(${rate}px)`;
            
            // Keep left side (text) fixed to prevent overlap
            heroLeft.style.transform = 'translateY(0)';
            heroLeft.style.position = 'relative';
            heroLeft.style.zIndex = '10';
          } else {
            heroRight.style.transform = 'translateY(0)';
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    });
  } else if (heroLeft && heroRight) {
    // On mobile, ensure no transforms
    heroLeft.style.transform = 'none';
    heroRight.style.transform = 'none';
  }
  
  // ======================
  // Cursor Effect (Desktop only - disabled on mobile)
  // ======================
  if (!isMobile && window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(139, 92, 246, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.2s ease, opacity 0.2s ease;
      opacity: 0;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    
    // Smooth cursor follow
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      cursor.style.left = `${cursorX - 10}px`;
      cursor.style.top = `${cursorY - 10}px`;
      
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    
    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-card, .skill-card');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.borderColor = 'rgba(139, 92, 246, 0.8)';
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = 'rgba(139, 92, 246, 0.5)';
      });
    });
  }
  
  // ======================
  // Add spinning animation for loading state
  // ======================
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // ======================
  // Navbar scroll effect
  // ======================
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.style.padding = '12px 8vw';
      navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
      navbar.style.padding = '20px 8vw';
      navbar.style.background = 'rgba(10, 10, 15, 0.8)';
    }
    
    lastScroll = currentScroll;
  });
  
  // ======================
  // Initialize animations on load
  // ======================
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
  
  console.log('Portfolio loaded successfully! 🎉');
});

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
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission (replace with actual API call)
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Message Sent!
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
        
      } catch (error) {
        // Show error message
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          Failed to Send
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      }
    });
  }
  
  // ======================
  // Animated Background Canvas
  // ======================
  const bgCanvas = document.getElementById('bg-canvas');
  
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let particles = [];
    const particleCount = 60;
    const dpr = window.devicePixelRatio || 1;
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
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 150)})`;
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
  // Parallax Effect on Hero
  // ======================
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  
  if (hero && heroContent) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      
      if (scrolled <= hero.offsetHeight) {
        heroContent.style.transform = `translateY(${rate}px)`;
        heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.5;
      }
    });
  }
  
  // ======================
  // Cursor Effect (Desktop only)
  // ======================
  if (window.innerWidth > 768) {
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

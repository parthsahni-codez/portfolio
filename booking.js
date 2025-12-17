document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('booking-form');
  const bgCanvas = document.getElementById('bg-canvas');

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

  // Animated background (soft shooting stars) for booking page
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let stars = [];
    const starCount = 70;
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
      star.y = Math.random() * h * 0.9;
      star.size = Math.random() * 1.2 + 0.4;
      star.speed = Math.random() * 0.55 + 0.2;
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
          ctx.lineTo(star.x - star.speed * 20, star.y + star.speed * 12);
          ctx.stroke();
        }

        star.x += star.speed * 1.4;
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


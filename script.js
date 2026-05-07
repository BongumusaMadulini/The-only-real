/* =============================================
   BONGUMUSA MADULINI — PORTFOLIO SCRIPT
   ============================================= */

// ─── CUSTOM CURSOR ───────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});
function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();
document.querySelectorAll('a, button, .skill-card, .project-card, .social-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width='14px'; cursor.style.height='14px'; follower.style.width='50px'; follower.style.height='50px'; });
  el.addEventListener('mouseleave', () => { cursor.style.width='8px';  cursor.style.height='8px';  follower.style.width='30px'; follower.style.height='30px'; });
});

// ─── NAVIGATION ──────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
});
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => { hamburger.classList.remove('active'); navLinks.classList.remove('open'); });
});
function updateActiveLink() {
  const scrollY = window.scrollY + 120;
  document.querySelectorAll('section[id]').forEach(section => {
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight);
  });
}

// ─── SMOOTH SCROLL ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ─── VISIBILITY SAFETY NET ───────────────────
// Ensures ALL content is visible regardless of whether GSAP fires.
// Without this, GSAP sets opacity:0 and if ScrollTrigger doesn't fire the
// content stays invisible forever.
function ensureVisible() {
  document.querySelectorAll(
    '.section-tag, .section-title, .about-text, .about-code-card, ' +
    '.skill-card, .edu-card, .project-card, .contact-form-wrap, ' +
    '.contact-info, .highlight-item, .edu-skills, .edu-desc, ' +
    '.project-body, .project-thumbnail, .project-tags, .project-footer'
  ).forEach(el => {
    el.style.opacity   = '1';
    el.style.transform = 'none';
    el.style.visibility = 'visible';
  });
}
// Run immediately AND as fallback after 1s
ensureVisible();
setTimeout(ensureVisible, 1000);

// ─── GSAP ANIMATIONS ─────────────────────────
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // clearProps:'all' removes the inline style after the animation completes
  // so the element returns to its natural CSS state and stays visible.
  const cp = 'all';

  // Hero — no scroll trigger, runs on page load
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-available',     { y:30,  opacity:0, duration:0.6, clearProps:cp })
    .from('.hero-title',         { y:50,  opacity:0, duration:0.8, clearProps:cp }, '-=0.3')
    .from('.hero-roles',         { y:30,  opacity:0, duration:0.6, clearProps:cp }, '-=0.5')
    .from('.hero-desc',          { y:30,  opacity:0, duration:0.6, clearProps:cp }, '-=0.4')
    .from('.hero-actions',       { y:30,  opacity:0, duration:0.6, clearProps:cp }, '-=0.4')
    .from('.hero-stats',         { y:20,  opacity:0, duration:0.5, clearProps:cp }, '-=0.3')
    .from('.profile-ring-outer', { scale:0.8, opacity:0, duration:0.8, ease:'back.out(1.5)', clearProps:cp }, '-=0.8')
    .from('.profile-badge',      { y:20,  opacity:0, duration:0.5, stagger:0.2, clearProps:cp }, '-=0.4');

  // Reusable scroll-triggered fade helper
  function scrollFade(selector, trigger, opts) {
    if (!document.querySelector(selector)) return;
    gsap.from(selector, {
      scrollTrigger: { trigger: trigger || selector, start: 'top 88%', toggleActions: 'play none none none' },
      y: opts.y ?? 40, x: opts.x ?? 0, opacity: 0,
      duration: opts.dur ?? 0.65, stagger: opts.st ?? 0,
      ease: 'power2.out', clearProps: cp
    });
  }

  // About
  scrollFade('.about-text',      '.about-grid',      { x:-40, y:0, dur:0.7 });
  scrollFade('.about-code-card', '.about-grid',      { x: 40, y:0, dur:0.7 });
  scrollFade('.highlight-item',  '.about-highlights',{ y:20, st:0.08 });

  // Skills
  scrollFade('.skill-card', '.skills-grid', { y:40, dur:0.5, st:0.07 });
  ScrollTrigger.create({
    trigger: '.skills-grid', start: 'top 82%', once: true,
    onEnter: () => {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)'; bar.style.width = w; }, 150);
      });
    }
  });

  // Education
  scrollFade('.edu-card', '.education-grid', { y:40, dur:0.6, st:0.15 });

  // Projects
  scrollFade('.project-card', '.projects-grid', { y:50, dur:0.6, st:0.12 });

  // Contact
  scrollFade('.contact-form-wrap', '.contact-grid', { x:-40, y:0, dur:0.7 });
  scrollFade('.contact-info',      '.contact-grid', { x: 40, y:0, dur:0.7 });
}

// ─── CONTACT FORM (Mailto) ───────────────────
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');
const submitBtn   = document.getElementById('submitBtn');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !subject || !message) { showStatus('Please fill in all fields.', 'error'); return; }

  submitBtn.querySelector('.btn-text').style.display   = 'none';
  submitBtn.querySelector('.btn-loading').style.display = 'flex';
  submitBtn.disabled = true;

  // ⚠️  REPLACE with your actual email address below
  const yourEmail = 'bongumusamadulini@gmail.com';
  const mailHref  = `mailto:${yourEmail}?subject=${encodeURIComponent('[Portfolio] ' + subject)}&body=${encodeURIComponent('Hi Bongumusa,\n\nMy name is ' + name + ' (' + email + ').\n\n' + message + '\n\nSent from your portfolio.')}`;

  setTimeout(() => {
    window.location.href = mailHref;
    submitBtn.querySelector('.btn-text').style.display   = 'flex';
    submitBtn.querySelector('.btn-loading').style.display = 'none';
    submitBtn.disabled = false;
    showStatus('✓ Email client opened — hit Send to deliver your message!', 'success');
    contactForm.reset();
  }, 800);
});

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = 'form-status ' + type;
  setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 6000);
}

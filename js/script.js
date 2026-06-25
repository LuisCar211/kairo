/* ==============================================
   KAIRO — JavaScript Global
   Navbar · Scroll animations · FAQ · Form
   ============================================== */

/* ---- Navbar scroll + hamburger ---- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightActiveLink();
  });
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Active nav link ---- */
function highlightActiveLink() {
  const sections  = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 130;
  sections.forEach(s => {
    const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
    if (!link) return;
    link.classList.toggle('active', scrollPos >= s.offsetTop && scrollPos < s.offsetTop + s.offsetHeight);
  });
}

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

/* ---- Scroll fade-in animations ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => entry.target.classList.add('visible'),
               (Number(entry.target.dataset.delay) || 0) * 85);
    io.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function initFadeIns() {
  const sels = [
    '.svc-card','.proc-card','.ben-card','.tech-pill',
    '.feature-item','.plan-card','.testi-card',
    '.step-card','.section-head'
  ];
  sels.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, idx) => {
      el.classList.add('fade-in');
      el.dataset.delay = idx;
      io.observe(el);
    });
  });
}

/* ---- FAQ accordion ---- */
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  const isOpen = item.classList.contains('open');

  // Cerrar todos los abiertos
  document.querySelectorAll('.faq-item.open').forEach(i => {
    i.classList.remove('open');
    // ✅ Forzar display none explícitamente
    i.querySelector('.faq-a').style.display = 'none';
  });

  // Abrir el seleccionado si estaba cerrado
  if (!isOpen) {
    item.classList.add('open');
    // ✅ Forzar display block explícitamente
    answer.style.display = 'block';
  }
}

/* ---- Formulario ---- */
/* ---- Formulario con Netlify Forms ---- */
async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const btn  = document.getElementById('submitBtn');

  // Validación básica
  const nombre  = document.getElementById('nombre');
  const email   = document.getElementById('email');
  const empresa = document.getElementById('empresa');
  const mensaje = document.getElementById('mensaje');
  let ok = true;

  [nombre, email, empresa, mensaje].forEach(el => {
    if (!el.value.trim()) {
      el.style.borderColor = 'var(--red)';
      ok = false;
    } else {
      el.style.borderColor = '';
    }
  });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.style.borderColor = 'var(--red)';
    ok = false;
  }

  if (!ok) {
    btn.style.animation = 'shake .4s ease';
    setTimeout(() => btn.style.animation = '', 400);
    return;
  }

  // Enviar a Netlify
  btn.textContent = 'ENVIANDO…';
  btn.disabled    = true;
  btn.style.opacity = '.7';

  try {
    const data = new FormData(form);
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    });

    // Mostrar éxito
    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';

  } catch (error) {
    btn.textContent  = 'ENVIAR CONSULTA →';
    btn.disabled     = false;
    btn.style.opacity = '1';
    alert('Hubo un error. Por favor intenta de nuevo o escríbenos directamente.');
  }
}

/* ---- Extra CSS: shake ---- */
const s = document.createElement('style');
s.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0);}
    20%{transform:translateX(-7px);}
    40%{transform:translateX(7px);}
    60%{transform:translateX(-5px);}
    80%{transform:translateX(5px);}
  }
`;
document.head.appendChild(s);

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  initFadeIns();
  // Abrir primer FAQ si existe
  const firstFaq = document.querySelector('.faq-item .faq-q');
  if (firstFaq) toggleFaq(firstFaq);
});
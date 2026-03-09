/* ======================================================
   Makhan Bhog – Professional JS
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PWA INSTALL ---------- */
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');
  const bannerInstallBtn = document.getElementById('bannerInstallBtn');

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.add('show');
  });

  function doInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(r => {
        deferredPrompt = null;
        if (installBtn) installBtn.classList.remove('show');
      });
    } else {
      const guide = document.getElementById('installGuide');
      const content = document.getElementById('installGuideContent');
      if (!guide || !content) return;
      const iOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      content.innerHTML = iOS
        ? '<ol><li>Tap the <strong>Share</strong> button <i class="fas fa-share-from-square"></i></li><li>Scroll down and tap <strong>"Add to Home Screen"</strong></li><li>Tap <strong>Add</strong></li></ol>'
        : '<ol><li>Open this page in <strong>Chrome / Edge</strong></li><li>Tap the <strong>menu (⋮)</strong> button</li><li>Select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong></li></ol>';
      guide.classList.add('show');
    }
  }

  if (installBtn) installBtn.addEventListener('click', doInstall);
  if (bannerInstallBtn) bannerInstallBtn.addEventListener('click', doInstall);

  const guideClose = document.getElementById('installGuideClose');
  const guideOverlay = document.getElementById('installGuide');
  if (guideClose && guideOverlay) {
    guideClose.addEventListener('click', () => guideOverlay.classList.remove('show'));
    guideOverlay.addEventListener('click', e => { if (e.target === guideOverlay) guideOverlay.classList.remove('show'); });
  }

  /* ---------- TESTIMONIAL SLIDER ---------- */
  const reviews = [
    { name: 'Rajesh Kumar', location: 'Chapra, Bihar', text: 'Best atta quality I\'ve found! Soft rotis every time. Been buying from Makhan Bhog for 8 years.', rating: 5 },
    { name: 'Priya Devi', location: 'Siwan, Bihar', text: 'Wholesale prices are genuinely lower than market. I order 50kg monthly and save a lot.', rating: 5 },
    { name: 'Hotel Sagar', location: 'Chhapra', text: 'We\'ve been getting all our supplies from Shah Brothers. Rice, dal, oil — everything in one place at wholesale.', rating: 5 },
    { name: 'Sanjay Gupta', location: 'Gopalganj', text: 'The spices are truly pure — you can taste the difference. Haldi and mirch quality is top notch.', rating: 5 },
    { name: 'Manisha Singh', location: 'Ballia, UP', text: 'I tried multigrain atta and my family loves it. Will keep ordering. Prices are fair and quality is premium.', rating: 4 },
    { name: 'Anand Provision Store', location: 'Dighwara', text: 'As a retailer, I get all stock from Makhan Bhog. Best wholesale rates in the area.', rating: 5 },
    { name: 'Sunita Kumari', location: 'Revelganj', text: 'Delivery at reasonable rates and always on time. The besan quality is excellent for my sweet shop.', rating: 5 },
    { name: 'Vikash Yadav', location: 'Marhowra', text: 'Bought 25kg rice and 10kg dal. Packed well, delivered on time. Highly recommended!', rating: 5 },
    { name: 'Deepak Traders', location: 'Ekma', text: 'Shah Brothers give best wholesale prices. I supply to 3 districts from their stock.', rating: 5 },
    { name: 'Kavita Mishra', location: 'Sonepur', text: 'Pure desi ghee at almost wholesale rate — my family can taste the quality difference. Thank you!', rating: 5 },
    { name: 'Amit Sahni', location: 'Chapra', text: 'Customer service is what sets them apart. Any problem, one call and it\'s resolved. 25 years trust!', rating: 5 },
    { name: 'Manoj General Store', location: 'Taraiya', text: 'Complete grocery supply in one order. Saves me time and money. Been buying since 5 years.', rating: 4 }
  ];

  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('sliderDots');
  if (track && dotsWrap) {
    track.innerHTML = reviews.map(r => {
      const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
      const initials = r.name.split(' ').map(w => w[0]).join('').substring(0, 2);
      return `<div class="testimonial-card"><div class="stars">${stars}</div><p class="review">"${r.text}"</p><div class="reviewer"><div class="reviewer-avatar">${initials}</div><div class="reviewer-info"><strong>${r.name}</strong><span>${r.location}</span></div></div></div>`;
    }).join('');

    let idx = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    function getPerView() { return window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3; }
    const totalPages = () => Math.ceil(reviews.length / getPerView());

    function renderDots() {
      const pages = totalPages();
      dotsWrap.innerHTML = Array.from({ length: pages }, (_, i) =>
        `<span class="dot${i === idx ? ' active' : ''}" data-i="${i}"></span>`
      ).join('');
    }

    function slide() {
      const perView = getPerView();
      const gap = 20;
      if (!cards.length) return;
      const cardW = cards[0].offsetWidth + gap;
      const maxIdx = Math.max(0, Math.ceil(reviews.length / perView) - 1);
      if (idx > maxIdx) idx = maxIdx;
      track.style.transform = `translateX(-${idx * perView * cardW}px)`;
      renderDots();
    }

    function setCardWidth() {
      const perView = getPerView();
      const gap = 20;
      const containerW = track.parentElement.offsetWidth;
      const w = (containerW - gap * (perView - 1)) / perView;
      cards.forEach(c => c.style.width = w + 'px');
      slide();
    }

    setCardWidth();
    window.addEventListener('resize', setCardWidth);

    const prevBtn = document.getElementById('tPrev');
    const nextBtn = document.getElementById('tNext');
    if (prevBtn) prevBtn.addEventListener('click', () => { idx = Math.max(0, idx - 1); slide(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { idx = Math.min(totalPages() - 1, idx + 1); slide(); });
    dotsWrap.addEventListener('click', e => {
      const dot = e.target.closest('.dot');
      if (!dot) return;
      idx = parseInt(dot.dataset.i);
      slide();
    });

    // Auto play
    let autoPlay = setInterval(() => { idx = (idx + 1) % totalPages(); slide(); }, 5000);
    const slider = document.getElementById('testimonialSlider');
    if (slider) {
      slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
      slider.addEventListener('mouseleave', () => { autoPlay = setInterval(() => { idx = (idx + 1) % totalPages(); slide(); }, 5000); });
    }

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; clearInterval(autoPlay); }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) idx = Math.min(totalPages() - 1, idx + 1);
        else idx = Math.max(0, idx - 1);
        slide();
      }
      autoPlay = setInterval(() => { idx = (idx + 1) % totalPages(); slide(); }, 5000);
    });
  }

  /* ---------- DARK / LIGHT MODE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- ACTIVE NAV ON SCROLL ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  if (sections.length && navItems.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 120;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const h = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollY >= top && scrollY < top + h) {
          navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + id) a.classList.add('active');
          });
        }
      });
    }, { passive: true });
  }

  /* ---------- PRODUCT FILTER ---------- */
  const catBtns = document.querySelectorAll('.product-categories .cat-btn');
  const productCards = document.querySelectorAll('.product-card');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      productCards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
      });
    });
  });

  /* Category card -> product filter */
  document.querySelectorAll('.category-card[data-cat]').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const cat = card.dataset.cat;
      const targetBtn = document.querySelector(`.cat-btn[data-category="${cat}"]`);
      if (targetBtn) {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => targetBtn.click(), 400);
        }
      }
    });
  });

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current).toLocaleString();
        }, 16);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.3 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------- SCROLL FADE IN ---------- */
  const fadeEls = document.querySelectorAll('.section-header, .category-card, .deal-card, .step-card, .product-card, .feature-card, .stat-item, .info-card, .about-grid, .gallery-item, .highlight');
  if (fadeEls.length) {
    fadeEls.forEach(el => el.classList.add('fade-in'));
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach((el, i) => {
      const siblings = el.parentElement.children;
      const idx = Array.from(siblings).indexOf(el);
      if (idx < 7) el.classList.add('stagger-' + (idx + 1));
      fadeObserver.observe(el);
    });
  }

  /* ---------- SCROLL TO TOP ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- ENQUIRY FORM ---------- */
  const form = document.getElementById('enquiryForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form && formSuccess) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      fetch(form.action, { method: 'POST', body: data, mode: 'no-cors' });

      // WhatsApp
      const name = data.get('fullName') || '';
      const phone = data.get('phone') || '';
      const orderType = data.get('orderType') || '';
      const products = data.getAll('products').join(', ');
      const qty = data.get('quantity') || '';
      const msg = data.get('message') || '';
      let waMsg = `*New Enquiry – Makhan Bhog*%0A`;
      waMsg += `Name: ${name}%0A`;
      waMsg += `Phone: ${phone}%0A`;
      if (orderType) waMsg += `Order Type: ${orderType}%0A`;
      if (products) waMsg += `Products: ${products}%0A`;
      if (qty) waMsg += `Quantity: ${qty}%0A`;
      if (msg) waMsg += `Message: ${msg}%0A`;
      window.open(`https://wa.me/919199774408?text=${waMsg}`, '_blank');

      form.classList.add('hidden');
      formSuccess.classList.remove('hidden');
    });
  }

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- GALLERY FILTER ---------- */
  const galBtns = document.querySelectorAll('.gal-btn');
  const galItems = document.querySelectorAll('.gallery-item');
  galBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galItems.forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.type === filter) ? '' : 'none';
      });
    });
  });

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbContent = document.getElementById('lbContent');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let lbItems = [];
  let lbIdx = 0;

  function openLightbox(index) {
    lbItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
    lbIdx = index;
    showLbItem();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function showLbItem() {
    if (!lbItems.length || !lbContent) return;
    const item = lbItems[lbIdx];
    const img = item.querySelector('img');
    const video = item.querySelector('video');
    // Pause any playing video
    const prevVideo = lbContent.querySelector('video');
    if (prevVideo) prevVideo.pause();
    if (video) {
      lbContent.innerHTML = `<video src="${video.src}" controls autoplay style="max-width:90vw;max-height:85vh;border-radius:10px;"></video>`;
    } else if (img) {
      lbContent.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`;
    }
    if (lbCounter) lbCounter.textContent = `${lbIdx + 1} / ${lbItems.length}`;
  }

  function closeLightbox() {
    const video = lbContent ? lbContent.querySelector('video') : null;
    if (video) video.pause();
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => { lbIdx = (lbIdx - 1 + lbItems.length) % lbItems.length; showLbItem(); });
  if (lbNext) lbNext.addEventListener('click', () => { lbIdx = (lbIdx + 1) % lbItems.length; showLbItem(); });

  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
    if (e.key === 'ArrowRight' && lbNext) lbNext.click();
  });

  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  }

});

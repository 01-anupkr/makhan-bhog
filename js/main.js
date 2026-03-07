// ===== PWA INSTALL PROMPT =====
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const installGuide = document.getElementById('installGuide');
const installGuideClose = document.getElementById('installGuideClose');
const installGuideContent = document.getElementById('installGuideContent');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
}

function showInstallGuide() {
  if (!installGuide || !installGuideContent) return;
  let html = '';
  if (isIOS()) {
    html = `
      <p class="ig-step"><span class="ig-num">1</span> Tap the <strong>Share</strong> button <i class="fas fa-arrow-up-from-bracket"></i> at the bottom of Safari</p>
      <p class="ig-step"><span class="ig-num">2</span> Scroll down and tap <strong>"Add to Home Screen"</strong> <i class="fas fa-plus-square"></i></p>
      <p class="ig-step"><span class="ig-num">3</span> Tap <strong>"Add"</strong> — the app icon will appear on your home screen!</p>
      <p class="ig-note"><i class="fas fa-info-circle"></i> Works best in <strong>Safari</strong> browser on iPhone/iPad.</p>`;
  } else {
    html = `
      <p class="ig-step"><span class="ig-num">1</span> Tap the <strong>menu</strong> <i class="fas fa-ellipsis-vertical"></i> (three dots) in your browser</p>
      <p class="ig-step"><span class="ig-num">2</span> Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong></p>
      <p class="ig-step"><span class="ig-num">3</span> Confirm by tapping <strong>"Install"</strong> — done!</p>
      <p class="ig-note"><i class="fas fa-info-circle"></i> Works best in <strong>Chrome</strong> or <strong>Edge</strong> browser.</p>`;
  }
  installGuideContent.innerHTML = html;
  installGuide.classList.add('active');
}

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (isStandalone()) return;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (outcome === 'accepted') installBtn.style.display = 'none';
    } else {
      showInstallGuide();
    }
  });
}

if (installGuideClose) {
  installGuideClose.addEventListener('click', () => installGuide.classList.remove('active'));
}
if (installGuide) {
  installGuide.addEventListener('click', (e) => {
    if (e.target === installGuide) installGuide.classList.remove('active');
  });
}

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  if (installBtn) installBtn.style.display = 'none';
  if (installGuide) installGuide.classList.remove('active');
});

// Hide install button if already installed as app
if (isStandalone() && installBtn) installBtn.style.display = 'none';

// ===== HERO PARTICLE EFFECT =====
function createParticles() {
  const container = document.getElementById("heroParticles");
  if (!container) return;
  const count = window.innerWidth < 768 ? 15 : 30;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.classList.add("hero-particle");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.width = particle.style.height = (Math.random() * 4 + 2) + "px";
    particle.style.animationDuration = (Math.random() * 8 + 6) + "s";
    particle.style.animationDelay = (Math.random() * 5) + "s";
    particle.style.background = Math.random() > 0.5
      ? "rgba(212, 160, 23, 0.4)"
      : "rgba(255, 255, 255, 0.2)";
    container.appendChild(particle);
  }
}
createParticles();

// ===== DYNAMIC TESTIMONIALS SLIDER =====
(function () {
  const reviews = [
    { name: "Rajesh Kumar", role: "Retail Customer", icon: "fa-user", stars: 5, product: "Wheat Atta", city: "Chhapra", date: "2 weeks ago", text: "Makhan Bhog ka atta sabse alag hai — soft roti banti hai, bilkul ghar jaisi quality. Hum 5 saal se inhi se lete hain." },
    { name: "Amit Gupta", role: "Wholesale Dealer", icon: "fa-store", stars: 5, product: "Bulk Atta & Rice", city: "Siwan", date: "1 month ago", text: "Wholesale price mein best quality milti hai. Delivery bhi time pe hoti hai. Shah's Brothers pe pura bharosa hai." },
    { name: "Sunil Verma", role: "Restaurant Owner", icon: "fa-utensils", stars: 4.5, product: "Rice & Atta", city: "Patna", date: "3 weeks ago", text: "Pure quality, no mixing — we have been ordering rice and atta for our restaurant chain. Very consistent quality every time." },
    { name: "Priya Devi", role: "Housewife", icon: "fa-house-user", stars: 5, product: "Besan & Sooji", city: "Gopalganj", date: "1 week ago", text: "Besan se pakode banaye toh bilkul crispy bane. Sooji ka halwa bhi bahut tasty bana. Packing bhi achi hoti hai." },
    { name: "Vikram Singh", role: "Kirana Store", icon: "fa-shop", stars: 5, product: "All Products", city: "Ballia", date: "5 days ago", text: "Mere store pe sirf Makhan Bhog rakhte hain — customer kabhi complain nahi karte. Quality aur price dono perfect hai." },
    { name: "Mohammad Irfan", role: "Bakery Owner", icon: "fa-bread-slice", stars: 4.5, product: "Maida & Sooji", city: "Mau", date: "2 months ago", text: "Bakery ke liye maida chahiye thi bulk mein — inki maida se bread bahut soft banti hai. Regular supplier ban gaye hain." },
    { name: "Anita Sharma", role: "Catering Service", icon: "fa-bowl-food", stars: 5, product: "Atta & Spices", city: "Varanasi", date: "3 days ago", text: "Catering business mein quality sabse important hai. Makhan Bhog se atta aur masale dono lete hain — kabhi disappoint nahi kiya." },
    { name: "Deepak Yadav", role: "Retail Customer", icon: "fa-user", stars: 5, product: "Rice", city: "Deoria", date: "1 week ago", text: "Chawal ki quality ekdum first class hai. Daane lambe aur khushbudaar hain. Poore family ko pasand aaya." },
    { name: "Santosh Tiwari", role: "Distributor", icon: "fa-truck", stars: 5, product: "Wholesale Supply", city: "Buxar", date: "4 days ago", text: "Bihar ke 3 district mein inke products supply karte hain. Koi complaint nahi aati — sab log satisfy hain." },
    { name: "Kavita Kumari", role: "Housewife", icon: "fa-house-user", stars: 4.5, product: "Atta & Dals", city: "Revelganj", date: "6 days ago", text: "Roti fulke jaisi banti hai inka atta use karke. Dal bhi jaldi gal jaati hai. Sab cheezein fresh milti hain." },
    { name: "Ravi Prasad", role: "Hotel Owner", icon: "fa-hotel", stars: 5, product: "Rice & Oil", city: "Hajipur", date: "2 weeks ago", text: "Hotel ke liye bulk order dete hain — hamesha time pe delivery hoti hai. Rice ek number hai, guest hamesha tarif karte hain." },
    { name: "Sunita Gupta", role: "Sweet Shop", icon: "fa-candy-cane", stars: 5, product: "Besan & Maida", city: "Sonepur", date: "10 days ago", text: "Sweet shop ke liye besan aur maida yahi se lete hain. Laddu aur barfi ki quality tabhi achi banti hai jab material acha ho." }
  ];

  const track = document.getElementById("testimonialTrack");
  const dotsContainer = document.getElementById("sliderDots");
  if (!track || !dotsContainer) return;

  function renderStars(count) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(count)) html += '<i class="fas fa-star"></i>';
      else if (i - count === 0.5) html += '<i class="fas fa-star-half-alt"></i>';
      else html += '<i class="far fa-star"></i>';
    }
    return html;
  }

  function buildCard(r) {
    return `<div class="testimonial-card">
      <div class="testimonial-header">
        <div class="testimonial-stars">${renderStars(r.stars)}</div>
        <span class="testimonial-verified"><i class="fas fa-circle-check"></i> Verified</span>
      </div>
      <span class="testimonial-product"><i class="fas fa-tag"></i> ${r.product}</span>
      <p class="testimonial-text">"${r.text}"</p>
      <div class="testimonial-footer">
        <div class="testimonial-author">
          <div class="author-avatar"><i class="fas ${r.icon}"></i></div>
          <div>
            <strong>${r.name}</strong>
            <span>${r.role} · ${r.city}</span>
          </div>
        </div>
        <span class="testimonial-date">${r.date}</span>
      </div>
    </div>`;
  }

  // Determine how many cards to show per view
  function cardsPerView() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  let perView = cardsPerView();
  let currentSlide = 0;
  let totalSlides;
  let autoPlayTimer;

  function renderSlider() {
    perView = cardsPerView();
    totalSlides = Math.ceil(reviews.length / perView);
    track.innerHTML = reviews.map(buildCard).join("");
    // Build dots
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.classList.add("slider-dot");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    }
    goTo(0);
  }

  function goTo(index) {
    currentSlide = index;
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    const cardWidth = track.children[0].offsetWidth + 25; // gap
    track.style.transform = "translateX(-" + (currentSlide * perView * cardWidth) + "px)";
    dotsContainer.querySelectorAll(".slider-dot").forEach((d, i) => {
      d.classList.toggle("active", i === currentSlide);
    });
  }

  document.getElementById("tPrev").addEventListener("click", () => { goTo(currentSlide - 1); resetAuto(); });
  document.getElementById("tNext").addEventListener("click", () => { goTo(currentSlide + 1); resetAuto(); });

  // Auto-play
  function startAuto() { autoPlayTimer = setInterval(() => goTo(currentSlide + 1), 5000); }
  function resetAuto() { clearInterval(autoPlayTimer); startAuto(); }

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(currentSlide + 1) : goTo(currentSlide - 1); resetAuto(); }
  }, { passive: true });

  // Pause on hover
  const slider = document.getElementById("testimonialSlider");
  slider.addEventListener("mouseenter", () => clearInterval(autoPlayTimer));
  slider.addEventListener("mouseleave", startAuto);

  renderSlider();
  startAuto();
  window.addEventListener("resize", () => { renderSlider(); resetAuto(); });
})();

// ===== DARK / LIGHT MODE TOGGLE =====
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (theme === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

// Load saved preference
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
let overlay = null;

function openMenu() {
  hamburger.classList.add("active");
  navLinks.classList.add("open");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.classList.add("nav-overlay", "show");
    overlay.addEventListener("click", closeMenu);
    document.body.appendChild(overlay);
  } else {
    overlay.classList.add("show");
  }
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  hamburger.classList.remove("active");
  navLinks.classList.remove("open");
  if (overlay) overlay.classList.remove("show");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  navLinks.classList.contains("open") ? closeMenu() : openMenu();
});

// Close on link click
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

function updateActiveNav() {
  const scrollPos = window.scrollY + 150;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPos >= top && scrollPos < top + height) {
      navItems.forEach((item) => {
        item.classList.remove("active");
        if (item.getAttribute("href") === `#${id}`) {
          item.classList.add("active");
        }
      });
    }
  });
}

window.addEventListener("scroll", updateActiveNav);

// ===== PRODUCT CATEGORY FILTER =====
const catBtns = document.querySelectorAll(".cat-btn");
const productCards = document.querySelectorAll(".product-card");

catBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    catBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;

    productCards.forEach((card, index) => {
      if (category === "all" || card.dataset.category === category) {
        card.classList.remove("hidden");
        card.style.animation = "none";
        card.offsetHeight; // reflow
        card.style.animation = `fadeInUp 0.4s ease ${index * 0.05}s forwards`;
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll(".counter");
let countersStarted = false;

function animateCounters() {
  counters.forEach((counter) => {
    const target = +counter.dataset.target;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.ceil(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    updateCounter();
  });
}

// Intersection Observer for counters
const statsSection = document.querySelector(".stats-banner");
if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    },
    { threshold: 0.3 }
  );
  statsObserver.observe(statsSection);
}

// ===== SCROLL FADE-IN ANIMATION =====
const fadeElements = document.querySelectorAll(
  ".product-card, .feature-card, .info-card, .highlight, .about-text, .about-img-placeholder, .testimonial-card, .about-image, .stat-item, .gallery-item"
);

fadeElements.forEach((el) => el.classList.add("fade-in"));

// Assign stagger classes to grid children
document.querySelectorAll(".products-grid, .features-grid, .testimonials-grid, .gallery-grid").forEach((grid) => {
  Array.from(grid.children).forEach((child, i) => {
    child.classList.add("stagger-" + ((i % 6) + 1));
  });
});

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);

fadeElements.forEach((el) => fadeObserver.observe(el));

// ===== ENQUIRY FORM =====
const enquiryForm = document.getElementById("enquiryForm");
const formSuccess = document.getElementById("formSuccess");

if (enquiryForm) {
  enquiryForm.addEventListener("submit", (e) => {
    // Don't prevent default — form submits natively into hidden iframe

    const submitBtn = enquiryForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Sending...';
    submitBtn.classList.add("btn-loading");
    submitBtn.disabled = true;

    // Collect form data for WhatsApp
    const fd = new FormData(enquiryForm);
    const name = fd.get("fullName") || "";
    const phone = fd.get("phone") || "";
    const city = fd.get("city") || "";
    const orderType = fd.get("orderType") || "";
    const products = fd.getAll("products").join(", ") || "";
    const quantity = fd.get("quantity") || "";
    const message = fd.get("message") || "";

    // Open WhatsApp with pre-filled message after a short delay
    const whatsappMsg = encodeURIComponent(
      `🌾 *New Enquiry - Makhan Bhog*\n\n` +
        `*Name:* ${name}\n` +
        `*Phone:* ${phone}\n` +
        `*City:* ${city}\n` +
        `*Order Type:* ${orderType}\n` +
        `*Products:* ${products}\n` +
        `*Quantity:* ${quantity}\n` +
        `*Message:* ${message}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/919199774408?text=${whatsappMsg}`, "_blank");
    }, 500);

    // Show success after short delay
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Enquiry';
      submitBtn.classList.remove("btn-loading");
      submitBtn.disabled = false;
      enquiryForm.style.display = "none";
      formSuccess.classList.remove("hidden");
    }, 2000);

    // Reset after 12 seconds
    setTimeout(() => {
      enquiryForm.reset();
      enquiryForm.style.display = "block";
      formSuccess.classList.add("hidden");
    }, 12000);
  });
}

// ===== SMOOTH SCROLL POLYFILL (for older browsers) =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ===== GALLERY FILTER =====
const galBtns = document.querySelectorAll(".gal-btn");
const galItems = document.querySelectorAll(".gallery-item");

galBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    galBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;

    galItems.forEach((item) => {
      if (filter === "all" || item.dataset.type === filter) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById("lightbox");
const lbContent = document.getElementById("lbContent");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
const lbCounter = document.getElementById("lbCounter");

let currentLbIndex = 0;
let visibleItems = [];

function getVisibleItems() {
  return Array.from(document.querySelectorAll(".gallery-item:not(.hidden)"));
}

function openLightbox(index) {
  visibleItems = getVisibleItems();
  currentLbIndex = index;
  showLightboxItem();
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  // Pause any playing videos
  const vid = lbContent.querySelector("video");
  if (vid) vid.pause();

  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  lbContent.innerHTML = "";
}

function showLightboxItem() {
  // Pause previous video if any
  const prevVid = lbContent.querySelector("video");
  if (prevVid) prevVid.pause();

  const item = visibleItems[currentLbIndex];
  const isVideo = item.dataset.type === "video";

  if (isVideo) {
    const src = item.querySelector("video").src;
    lbContent.innerHTML = `<video src="${src}" controls autoplay style="max-width:90vw;max-height:85vh;border-radius:8px;box-shadow:0 0 40px rgba(0,0,0,0.5)"></video>`;
  } else {
    const src = item.querySelector("img").src;
    const alt = item.querySelector("img").alt || "Gallery image";
    lbContent.innerHTML = `<img src="${src}" alt="${alt}" style="max-width:90vw;max-height:85vh;border-radius:8px;box-shadow:0 0 40px rgba(0,0,0,0.5)" />`;
  }

  lbCounter.textContent = `${currentLbIndex + 1} / ${visibleItems.length}`;
}

// Click gallery items to open lightbox
galItems.forEach((item) => {
  item.addEventListener("click", () => {
    visibleItems = getVisibleItems();
    const idx = visibleItems.indexOf(item);
    openLightbox(idx >= 0 ? idx : 0);
  });
});

lbClose.addEventListener("click", closeLightbox);

lbPrev.addEventListener("click", () => {
  currentLbIndex = (currentLbIndex - 1 + visibleItems.length) % visibleItems.length;
  showLightboxItem();
});

lbNext.addEventListener("click", () => {
  currentLbIndex = (currentLbIndex + 1) % visibleItems.length;
  showLightboxItem();
});

// Close on background click
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") {
    currentLbIndex = (currentLbIndex - 1 + visibleItems.length) % visibleItems.length;
    showLightboxItem();
  }
  if (e.key === "ArrowRight") {
    currentLbIndex = (currentLbIndex + 1) % visibleItems.length;
    showLightboxItem();
  }
});

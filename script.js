// ================= HERO SLIDER =================
const slides = document.querySelectorAll(".hero-slide");
const indicatorsContainer = document.querySelector(".hero-indicators");
const playBtn = document.getElementById("playToggle");
let currentSlide = 0;
let isPlaying = true;
let slideInterval;

// Build indicators
slides.forEach((_, i) => {
  const btn = document.createElement("button");
  if (i === 0) btn.classList.add("active");
  btn.addEventListener("click", () => {
    goToSlide(i);
    pauseAndResume();
  });
  indicatorsContainer.appendChild(btn);
});
const indicators = indicatorsContainer.querySelectorAll("button");

function showSlide(index) {
  slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
  indicators.forEach((btn, i) => btn.classList.toggle("active", i === index));
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
}

function startSlideShow() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideShow() {
  clearInterval(slideInterval);
}

function pauseAndResume() {
  stopSlideShow();
  isPlaying = false;
  updatePlayIcon();
  setTimeout(() => {
    isPlaying = true;
    updatePlayIcon();
    startSlideShow();
  }, 10000);
}

function updatePlayIcon() {
  playBtn.innerHTML = isPlaying
    ? '<svg viewBox="0 0 24 24"><path d="M4 2h4v20H4V2zm12 0h4v20h-4V2z"/></svg>' // Pause
    : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'; // Play
}

if (playBtn) {
  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      stopSlideShow();
    } else {
      startSlideShow();
    }
    isPlaying = !isPlaying;
    updatePlayIcon();
  });
}

startSlideShow();

// Fade-in animations when section is visible
const aboutSection = document.getElementById("about");
const animateElements = aboutSection.querySelectorAll(".animate-fade, .animate-slide-left, .animate-slide-right");

const aboutObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      animateElements.forEach(el => el.classList.add("visible"));
      animateElements.forEach(el => aboutObserver.observe(el));
    }
  });
});

animateElements.forEach(el => aboutObserver.observe(el));
// ================= MOBILE MENU =================//
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

// ================= SMOOTH SCROLLING =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      if (navLinks) navLinks.classList.remove("show");
    }
  });
});

// ================= FADE-IN SECTIONS =================
const faders = document.querySelectorAll(".fade-section");
const options = { threshold: 0.2 };

const observer = new IntersectionObserver((entries, observerRef) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observerRef.unobserve(entry.target);
    }
  });
}, options);

faders.forEach(fader => observer.observe(fader));

// ================= BOOKING MODAL =================
const bookingForm = document.getElementById("bookingForm");
const bookingModal = document.getElementById("bookingModal");
const closeBtn = document.querySelector(".close");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalMessage = document.getElementById("modalMessage");

if (bookingForm && bookingModal) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("guestName").value;
    const email = document.getElementById("guestEmail").value;
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const room = document.getElementById("roomType").value;

    modalMessage.innerHTML = `
      Thank you <strong>${name}</strong>!<br><br>
      Your booking request has been received.<br>
      📧 Confirmation will be sent to: <strong>${email}</strong><br><br>
      🏠 Room: <strong>${room}</strong><br>
      📅 Check-in: <strong>${checkIn}</strong><br>
      📅 Check-out: <strong>${checkOut}</strong><br><br>
      We will contact you shortly to confirm your stay at HomeStay Villa.
    `;

    bookingModal.style.display = "flex";
    bookingForm.reset();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      bookingModal.style.display = "none";
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      bookingModal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === bookingModal) {
      bookingModal.style.display = "none";
    }
  });
}

// ================= AMENITIES SECTION =================
const amenities = [
  { title: "High-Speed WiFi", description: "Stay connected with complimentary high-speed internet throughout the property", category: "tech", popular: true },
  { title: "Complimentary Breakfast", description: "Start your day with delicious homemade breakfast", category: "dining", popular: true },
  { title: "Fully Equipped Kitchen", description: "Modern kitchen with all appliances and cookware", category: "dining", popular: false },
  { title: "Swimming Pool (Under Construction)", description: "Refreshing swimming pool coming soon", category: "recreation", popular: false },
  { title: "24/7 Security", description: "Round-the-clock security for your peace of mind", category: "security", popular: true },
  { title: "Smart TV", description: "Entertainment with latest smart TV and streaming services", category: "tech", popular: false },
  { title: "Air Conditioning", description: "Climate control for your comfort in all seasons", category: "comfort", popular: true },
  { title: "Hot Water", description: "24-hour hot water supply for your convenience", category: "comfort", popular: false }
];

const amenitiesGrid = document.getElementById("amenitiesGrid");
const searchInput = document.getElementById("searchInput");
const popularOnlyCheckbox = document.getElementById("popularOnly");
const categoryButtons = document.querySelectorAll(".category-filters button");
const amenitiesCount = document.getElementById("amenitiesCount");
const noResults = document.getElementById("noResults");

let selectedCategory = "all";

function renderAmenities() {
  const searchTerm = searchInput.value.toLowerCase();
  const popularOnly = popularOnlyCheckbox.checked;

  let filtered = amenities.filter(a => {
    return (selectedCategory === "all" || a.category === selectedCategory) &&
           (!popularOnly || a.popular) &&
           (a.title.toLowerCase().includes(searchTerm) || a.description.toLowerCase().includes(searchTerm));
  });

  amenitiesGrid.innerHTML = "";

  if (filtered.length === 0) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
    filtered.forEach(a => {
      const card = document.createElement("div");
      card.className = "amenity-card";
      card.innerHTML = `
        <div class="icon">💎</div>
        ${a.popular ? '<div class="popular">Popular</div>' : ''}
        <div class="title">${a.title}</div>
        <div class="category">${a.category}</div>
        <div class="description">${a.description}</div>
      `;
      amenitiesGrid.appendChild(card);
    });
  }

  amenitiesCount.textContent = `Showing ${filtered.length} of ${amenities.length} amenities`;
}

// --- Event Listeners ---
searchInput.addEventListener("input", renderAmenities);
popularOnlyCheckbox.addEventListener("change", renderAmenities);

categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCategory = btn.dataset.category;
    renderAmenities();
  });
});

// Initial Render
renderAmenities();

// ================= CONTACT PAGE LOG =================

document.addEventListener("DOMContentLoaded", () => {
  console.log("Contact page loaded ✅");
});

// ================= FOOTER =================
// Auto-update year in footer
document.getElementById("year").textContent = new Date().getFullYear()

// Handle newsletter form
document.getElementById("newsletter-form").addEventListener("submit", function (e) {
  e.preventDefault()
  const email = this.querySelector("input").value
  alert(`Thanks for subscribing with: ${email}`)
  this.reset()
})
// ================= POLICY OVERLAY =================

// ---- Scrollspy for TOC links ----
window.addEventListener('scroll', onScroll); onScroll();

// ---- Simple accordion behavior ----
document.querySelectorAll('.accordion-item').forEach(item =>{
const btn = item.querySelector('.accordion-btn');
const panel = item.querySelector('.accordion-panel');
btn.addEventListener('click', ()=>{
const open = panel.style.display === 'block';
document.querySelectorAll('.accordion-panel').forEach(p=>p.style.display='none');
panel.style.display = open ? 'none' : 'block';
})
});


// ---- Print and Download (basic PDF download using print API) ----
document.getElementById('printBtn').addEventListener('click', ()=> window.print());


document.getElementById('downloadBtn').addEventListener('click', ()=>{
// This creates a new window and uses print-to-PDF from the browser.
// Browsers will let the user save as PDF.
window.print();
});


// ---- Cookie settings (mock modal) ----
document.getElementById('cookieSettings').addEventListener('click', ()=>{
const modalText = `Cookie Settings\n\nEssential cookies: Always enabled\nAnalytics cookies: ${confirm('Enable analytics cookies?') ? 'Enabled' : 'Disabled'}`;
alert(modalText);
});


// ---- Accept button simple action ----
document.getElementById('acceptBtn').addEventListener('click', ()=>{
localStorage.setItem('privacy_accepted', new Date().toISOString());
alert('Thanks — your preference has been saved.');
});


// ---- Small dynamic bits: year and lastUpdated (you can replace programmatically) ----
document.getElementById('year').textContent = new Date().getFullYear();
// If you want to set a different last-updated date, edit the element content.


// ---- Keyboard accessibility for accordion -----
document.querySelectorAll('.accordion-btn').forEach(btn=>{
btn.setAttribute('aria-expanded','false');
btn.addEventListener('click', ()=> btn.setAttribute('aria-expanded', btn.nextElementSibling.style.display !== 'block'));
});

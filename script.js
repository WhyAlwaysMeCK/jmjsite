// ======= Hamburger Menu Enhancements =======
const burger = document.getElementById("burger");
const navLinks = document.getElementById("nav-links");
const overlay = document.getElementById("overlay");
const navItems = document.querySelectorAll(".nav-links a");

const closeMenu = () => {
  burger.classList.remove("active");
  navLinks.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
  burger.setAttribute("aria-expanded", "false");
};

burger.addEventListener("click", (e) => {
  e.stopPropagation();
  const isActive = burger.classList.toggle("active");
  navLinks.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.style.overflow = isActive ? "hidden" : "";
  burger.setAttribute("aria-expanded", isActive.toString());
});

overlay.addEventListener("click", closeMenu);
navItems.forEach((item) => item.addEventListener("click", closeMenu));
document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
    closeMenu();
  }
});

// ======= Płynne przewijanie do sekcji =======
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      const headerHeight = document.querySelector(".header").offsetHeight;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      closeMenu(); // Zamknięcie menu mobilnego po kliknięciu
    }
  });
});

// ======= Karuzela + Kafelki wskaźników =======
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track.querySelectorAll("img"));
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const indicatorsContainer = document.createElement("div");
  let currentIndex = 0;
  let autoSlideInterval;
  let startX = 0;
  let isSwiping = false;

  indicatorsContainer.classList.add("carousel-indicators");
  document.querySelector(".carousel").appendChild(indicatorsContainer);

  slides.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("indicator");
    indicator.dataset.index = index;
    indicatorsContainer.appendChild(indicator);
    indicator.addEventListener("click", () => {
      goToSlide(index);
      startAutoSlide();
    });
  });

  function updateIndicators() {
    document.querySelectorAll(".indicator").forEach((ind, index) => {
      ind.classList.toggle("active", index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    updateIndicators();
  }

  function nextSlide() {
    goToSlide((currentIndex + 1) % slides.length);
  }

  function prevSlide() {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // ===== Obsługa gestów dotykowych =====
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    stopAutoSlide();
  });

  track.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    const moveX = e.touches[0].clientX - startX;
    if (moveX > 50) {
      prevSlide();
      isSwiping = false;
    } else if (moveX < -50) {
      nextSlide();
      isSwiping = false;
    }
  });

  track.addEventListener("touchend", () => {
    isSwiping = false;
    startAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  nextBtn.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  startAutoSlide();
  updateIndicators();
});

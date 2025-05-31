document.addEventListener("DOMContentLoaded", function () {
  // ======= Sticky Header & Smooth Scroll =======
  const header = document.querySelector(".header");
  const logoContainer = document.querySelector(".logo-container");

  if (logoContainer) {
    logoContainer.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      closeMenu();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
        closeMenu();
      }
    });
  });

  // ======= IntersectionObserver with Debounce =======
  const elements = document.querySelectorAll(".lista-ofert li");
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const observer = new IntersectionObserver(
    debounce((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
        }
      });
    }, 100),
    { threshold: 0.1 }
  );

  elements.forEach((el) => observer.observe(el));

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

  // ======= Improved Carousel Logic =======
  const track = document.querySelector(".carousel-track");
  if (track) {
    const slides = Array.from(track.querySelectorAll("img"));
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    let currentIndex = 0;
    let autoSlideInterval;
    let isAnimating = false;

    const goToSlide = (index) => {
      if (isAnimating) return;
      isAnimating = true;
      track.style.transition = "transform 0.5s ease";
      track.style.transform = `translateX(-${index * track.offsetWidth}px)`;
      currentIndex = index;
    };

    const nextSlide = () => {
      goToSlide((currentIndex + 1) % slides.length);
    };

    const prevSlide = () => {
      goToSlide((currentIndex - 1 + slides.length) % slides.length);
    };

    track.addEventListener("transitionend", () => {
      isAnimating = false;
    });

    const startAutoSlide = () => {
      if (slides.length > 1) {
        autoSlideInterval = setInterval(nextSlide, 5000);
      }
    };

    const stopAutoSlide = () => clearInterval(autoSlideInterval);

    startAutoSlide();

    if (prevBtn && nextBtn) {
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
    }

    track.addEventListener("mouseenter", stopAutoSlide);
    track.addEventListener("mouseleave", startAutoSlide);

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
      }
      if (e.key === "ArrowRight") {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
      }
    });
  }

  // ======= Prefers-Reduced-Motion Support =======
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    track.style.transition = "none";
  }
});

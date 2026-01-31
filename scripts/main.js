// ===== MAIN JAVASCRIPT FILE =====

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Premier Schools Exhibition - JS initialized");

  // ===== HEADER SCROLL DETECTION =====
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".site-header");
    if (window.scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Initialize all components
  initHeroSlider();
  initLogoMarquee();
  initSchoolCardsSlider();
  initFeaturesSlider();
  initFormValidation();
  initAccessibilityFeatures();

  // Handle reduced motion preference
  handleReducedMotion();

  // Lazy load images
  initLazyLoading();
});

// ===== HERO DUAL-AXIS SLIDER =====
function initHeroSlider() {
  const slider = document.querySelector(".hero__slider");
  if (!slider) return;

  const slides = document.querySelector(".hero__slides");
  const slidesCount = document.querySelectorAll(".hero__slide").length;
  const prevBtn = document.querySelector(".hero__control-btn--prev");
  const nextBtn = document.querySelector(".hero__control-btn--next");
  const dots = document.querySelectorAll(".hero__dot");
  const playBtn = document.querySelector(".hero__control-btn--play");

  let currentSlide = 0;
  let isAutoPlaying = true;
  let autoPlayInterval;
  let isVertical = false;
  let axisChangeInterval;

  // Start auto-play
  startAutoPlay();

  // Next slide function
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slidesCount;
    updateSlider();
  }

  // Previous slide function
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
    updateSlider();
  }

  // Update slider position
  function updateSlider() {
    const translateValue = isVertical
      ? `translateY(-${currentSlide * 100}%)`
      : `translateX(-${currentSlide * (100 / slidesCount)}%)`;

    slides.style.transform = translateValue;

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle("hero__dot--active", index === currentSlide);
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.setAttribute("aria-selected", index === currentSlide);
    });

    // Update slide aria-live
    const currentSlideEl = slides.children[currentSlide];
    currentSlideEl.setAttribute("aria-live", "polite");
  }

  // Start auto-play
  function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);

    autoPlayInterval = setInterval(() => {
      if (!isVertical) {
        nextSlide();
      }
    }, 5000);

    // Start axis change (vertical/horizontal)
    axisChangeInterval = setInterval(() => {
      isVertical = !isVertical;
      updateSlider();
    }, 10000); // Change axis every 10 seconds
  }

  // Pause auto-play
  function pauseAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
    if (axisChangeInterval) {
      clearInterval(axisChangeInterval);
      axisChangeInterval = null;
    }
    if (playBtn) {
      playBtn.innerHTML = '<span class="visually-hidden">Play slider</span>▶';
    }
    isAutoPlaying = false;
  }

  // Event Listeners
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextSlide();
      pauseAutoPlay();
    });

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevSlide();
      pauseAutoPlay();
    });

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (isAutoPlaying) {
        pauseAutoPlay();
      } else {
        startAutoPlay();
        if (playBtn) {
          playBtn.innerHTML =
            '<span class="visually-hidden">Pause slider</span>⏸';
        }
        isAutoPlaying = true;
      }
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      updateSlider();
      pauseAutoPlay();
    });
  });

  // Pause on hover
  slider.addEventListener("mouseenter", pauseAutoPlay);
  slider.addEventListener("mouseleave", () => {
    if (!isAutoPlaying) return;
    startAutoPlay();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!slider.matches(":focus-within")) return;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        prevSlide();
        pauseAutoPlay();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextSlide();
        pauseAutoPlay();
        break;
      case " ":
        e.preventDefault();
        if (playBtn) playBtn.click();
        break;
    }
  });

  // Touch/swipe for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left
      nextSlide();
    }

    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right
      prevSlide();
    }

    pauseAutoPlay();
  }
}

// ===== LOGO MARQUEE =====
function initLogoMarquee() {
  const marquee = document.querySelector(".logos__marquee");
  if (!marquee) return;

  const rows = document.querySelectorAll(".logos__row");

  // Pause on hover (already handled in CSS, but adding JS fallback)
  marquee.addEventListener("mouseenter", () => {
    rows.forEach((row) => {
      row.style.animationPlayState = "paused";
    });
  });

  marquee.addEventListener("mouseleave", () => {
    rows.forEach((row) => {
      row.style.animationPlayState = "running";
    });
  });

  // Focus management for accessibility - update to work with SVG images
  const logoImages = document.querySelectorAll(".logos__logo");
  logoImages.forEach((item) => {
    item.addEventListener("focus", () => {
      rows.forEach((row) => {
        row.style.animationPlayState = "paused";
      });
    });

    item.addEventListener("blur", () => {
      rows.forEach((row) => {
        row.style.animationPlayState = "running";
      });
    });
  });

  // Duplicate logos for seamless animation
  duplicateLogosForMarquee();
}

function duplicateLogosForMarquee() {
  const rows = document.querySelectorAll(".logos__row");

  rows.forEach((row) => {
    const logos = row.innerHTML;
    row.innerHTML = logos + logos + logos; // Triple for seamless loop
  });
}

// ===== SCHOOL CARDS SLIDER (MOBILE) =====
function initSchoolCardsSlider() {
  const sliderContainer = document.querySelector(".school-types__slider");
  if (!sliderContainer) return;

  const slidesContainer = document.querySelector(".school-types__slides");
  const slides = document.querySelectorAll(".school-card");
  const prevBtn = document.querySelector(".school-slider__btn--prev");
  const nextBtn = document.querySelector(".school-slider__btn--next");
  const dotsContainer = document.querySelector(".school-slider__dots");

  if (!slidesContainer || slides.length === 0) return;

  let currentIndex = 0;
  const slidesPerView = getSlidesPerView();

  // Create pagination dots
  if (dotsContainer) {
    createPaginationDots();
  }

  // Initialize slider
  updateSlider();

  // Event Listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateSlider();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex = Math.min(slides.length - slidesPerView, currentIndex + 1);
      updateSlider();
    });
  }

  // Touch/swipe for mobile
  let touchStartX = 0;

  sliderContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });

  sliderContainer.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const swipeThreshold = 50;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left
        currentIndex = Math.min(
          slides.length - slidesPerView,
          currentIndex + 1,
        );
      } else {
        // Swipe right
        currentIndex = Math.max(0, currentIndex - 1);
      }
      updateSlider();
    }
  });

  // Keyboard navigation
  sliderContainer.setAttribute("tabindex", "0");
  sliderContainer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      currentIndex = Math.max(0, currentIndex - 1);
      updateSlider();
    } else if (e.key === "ArrowRight") {
      currentIndex = Math.min(slides.length - slidesPerView, currentIndex + 1);
      updateSlider();
    }
  });

  // Window resize handler
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      currentIndex = 0;
      updateSlider();
    }, 250);
  });

  // Helper functions
  function getSlidesPerView() {
    const width = window.innerWidth;
    if (width < 480) return 1;
    if (width < 768) return 2;
    return 3;
  }

  function updateSlider() {
    const slideWidth = 100 / slidesPerView;
    const translateX = -currentIndex * slideWidth;
    slidesContainer.style.transform = `translateX(${translateX}%)`;

    // Update button states
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= slides.length - slidesPerView;
    }

    // Update dots
    updatePaginationDots();

    // Update aria-live for screen readers
    const activeSlides = Array.from(slides)
      .slice(currentIndex, currentIndex + slidesPerView)
      .map(
        (slide) =>
          slide.querySelector(".school-card__title")?.textContent || "",
      )
      .join(", ");

    slidesContainer.setAttribute(
      "aria-label",
      `Showing schools: ${activeSlides}`,
    );
  }

  function createPaginationDots() {
    const totalDots = Math.max(1, slides.length - slidesPerView + 1);
    dotsContainer.innerHTML = "";

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("button");
      dot.className = "school-slider__dot";
      dot.setAttribute("aria-label", `Go to slide group ${i + 1}`);
      dot.setAttribute("role", "tab");

      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSlider();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updatePaginationDots() {
    const dots = document.querySelectorAll(".school-slider__dot");
    const activeDotIndex = Math.min(currentIndex, dots.length - 1);

    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "school-slider__dot--active",
        index === activeDotIndex,
      );
      dot.setAttribute("aria-selected", index === activeDotIndex);
    });
  }
}

// ===== FEATURES SLIDER =====
function initFeaturesSlider() {
  const slider = document.querySelector(".features__slider");
  if (!slider) return;

  const slidesContainer = document.querySelector(".features__slides");
  const slides = document.querySelectorAll(".feature-card");
  const prevBtn = document.querySelector(".features__btn--prev");
  const nextBtn = document.querySelector(".features__btn--next");
  const playBtn = document.querySelector(".features__btn--play");
  const counter = document.querySelector(".features__counter");

  if (!slidesContainer || slides.length === 0) return;

  let currentSlide = 0;
  let isAutoPlaying = true;
  let autoPlayInterval;
  const slidesPerView = getSlidesPerView();

  // Start auto-play
  startAutoPlay();

  // Next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % (slides.length - slidesPerView + 1);
    updateSlider();
  }

  // Previous slide
  function prevSlide() {
    currentSlide =
      (currentSlide - 1 + (slides.length - slidesPerView + 1)) %
      (slides.length - slidesPerView + 1);
    updateSlider();
  }

  // Update slider
  function updateSlider() {
    const slideWidth = 100 / slidesPerView;
    const translateX = -currentSlide * slideWidth;
    slidesContainer.style.transform = `translateX(${translateX}%)`;

    // Update counter
    if (counter) {
      counter.textContent = `${currentSlide + 1} / ${slides.length - slidesPerView + 1}`;
    }

    // Update aria-live
    slidesContainer.setAttribute(
      "aria-label",
      `Showing feature ${currentSlide + 1} of ${slides.length - slidesPerView + 1}`,
    );
  }

  // Start auto-play
  function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);

    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, 4000);

    if (playBtn) {
      playBtn.innerHTML = '<span class="visually-hidden">Pause slider</span>⏸';
    }
    isAutoPlaying = true;
  }

  // Pause auto-play
  function pauseAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
    if (playBtn) {
      playBtn.innerHTML = '<span class="visually-hidden">Play slider</span>▶';
    }
    isAutoPlaying = false;
  }

  // Get slides per view based on screen width
  function getSlidesPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  // Event Listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      pauseAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      pauseAutoPlay();
    });
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (isAutoPlaying) {
        pauseAutoPlay();
      } else {
        startAutoPlay();
      }
    });
  }

  // Pause on hover
  slider.addEventListener("mouseenter", pauseAutoPlay);
  slider.addEventListener("mouseleave", () => {
    if (!isAutoPlaying) return;
    startAutoPlay();
  });

  // Touch/swipe for mobile
  let touchStartX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    pauseAutoPlay();
  });

  slider.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const swipeThreshold = 50;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  });

  // Window resize
  window.addEventListener("resize", () => {
    currentSlide = 0;
    updateSlider();
  });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
  const form = document.querySelector(".hero__form");
  if (!form) return;

  const phoneInput = form.querySelector('input[type="tel"]');
  const gradeSelect = form.querySelector("select");

  // Phone number validation
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      // Format as Indian phone number
      if (value.length > 0) {
        if (value.length <= 3) {
          value = value;
        } else if (value.length <= 5) {
          value = value.replace(/(\d{3})(\d{0,2})/, "$1-$2");
        } else if (value.length <= 10) {
          value = value.replace(/(\d{3})(\d{2})(\d{0,5})/, "$1-$2-$3");
        } else {
          value = value.substring(0, 10);
          value = value.replace(/(\d{3})(\d{2})(\d{0,5})/, "$1-$2-$3");
        }
      }

      e.target.value = value;
    });

    phoneInput.addEventListener("blur", function () {
      const value = this.value.replace(/\D/g, "");
      if (value.length < 10 && value.length > 0) {
        showError(this, "Please enter a valid 10-digit phone number");
      } else {
        clearError(this);
      }
    });
  }

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    // Validate required fields
    const requiredFields = form.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        showError(field, "This field is required");
        isValid = false;
      } else {
        clearError(field);
      }
    });

    // Validate phone number
    if (phoneInput && phoneInput.value) {
      const phoneDigits = phoneInput.value.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        showError(phoneInput, "Please enter a valid 10-digit phone number");
        isValid = false;
      }
    }

    if (isValid) {
      // Simulate form submission
      submitForm(form);
    }
  });

  // Show error function
  function showError(field, message) {
    clearError(field);

    field.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");

    const error = document.createElement("div");
    error.className = "form-error";
    error.textContent = message;
    error.setAttribute("role", "alert");

    field.parentNode.appendChild(error);
  }

  // Clear error function
  function clearError(field) {
    field.classList.remove("has-error");
    field.removeAttribute("aria-invalid");

    const existingError = field.parentNode.querySelector(".form-error");
    if (existingError) {
      existingError.remove();
    }
  }

  // Submit form function
  function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    submitBtn.setAttribute("aria-busy", "true");

    // Simulate API call
    setTimeout(() => {
      // Show success message
      const successMsg = document.createElement("div");
      successMsg.className = "form-success";
      successMsg.setAttribute("role", "alert");
      successMsg.innerHTML = `
                <strong>Thank you!</strong>
                <p>Your enquiry has been submitted successfully. We'll contact you soon.</p>
            `;

      form.parentNode.insertBefore(successMsg, form.nextSibling);

      // Reset form
      form.reset();

      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.removeAttribute("aria-busy");

      // Scroll to success message
      successMsg.scrollIntoView({ behavior: "smooth", block: "center" });

      // Remove success message after 5 seconds
      setTimeout(() => {
        successMsg.remove();
      }, 5000);
    }, 1500);
  }
}

// ===== ACCESSIBILITY FEATURES =====
function initAccessibilityFeatures() {
  // Trap focus in modals (if any)
  initFocusTrap();

  // Improve keyboard navigation
  enhanceKeyboardNavigation();

  // Add ARIA labels dynamically
  enhanceAriaLabels();
}

function initFocusTrap() {
  // Implementation for modal focus trapping
  // This would be expanded if modals were implemented
}

function enhanceKeyboardNavigation() {
  // Make all interactive elements focusable
  const interactiveElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  interactiveElements.forEach((el) => {
    // Add focus styles
    el.addEventListener("focus", function () {
      this.classList.add("focus-visible");
    });

    el.addEventListener("blur", function () {
      this.classList.remove("focus-visible");
    });
  });

  // Handle Enter key on buttons
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName === "BUTTON") {
      e.target.click();
    }
  });
}

function enhanceAriaLabels() {
  // Add missing aria labels
  const sections = document.querySelectorAll("section");
  sections.forEach((section, index) => {
    if (!section.id) {
      section.id = `section-${index + 1}`;
    }

    if (!section.getAttribute("aria-labelledby")) {
      const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading && !heading.id) {
        heading.id = `heading-${index + 1}`;
        section.setAttribute("aria-labelledby", heading.id);
      }
    }
  });
}

// ===== REDUCED MOTION PREFERENCE =====
function handleReducedMotion() {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Initial check
  if (mediaQuery.matches) {
    disableAnimations();
  }

  // Listen for changes
  mediaQuery.addEventListener("change", (e) => {
    if (e.matches) {
      disableAnimations();
    } else {
      enableAnimations();
    }
  });
}

function disableAnimations() {
  document.documentElement.classList.add("reduce-motion");

  // Stop all auto-playing sliders
  const sliders = document.querySelectorAll('[data-autoplay="true"]');
  sliders.forEach((slider) => {
    const stopBtn = slider.querySelector(
      '[aria-label*="Stop"], [aria-label*="Pause"]',
    );
    if (stopBtn) stopBtn.click();
  });
}

function enableAnimations() {
  document.documentElement.classList.remove("reduce-motion");
}

// ===== LAZY LOADING =====
function initLazyLoading() {
  if ("IntersectionObserver" in window) {
    const lazyImages = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;

          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }

          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
    });
  }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add CSS for form errors
const style = document.createElement("style");
style.textContent = `
    .has-error {
        border-color: var(--color-error) !important;
    }
    
    .form-error {
        color: var(--color-error);
        font-size: 0.875rem;
        margin-top: 4px;
    }
    
    .form-success {
        background: #d1fae5;
        border: 1px solid #10b981;
        border-radius: 8px;
        padding: var(--spacing-md);
        margin-top: var(--spacing-md);
        animation: fadeIn 0.6s ease;
    }
    
    .form-success strong {
        color: #065f46;
        display: block;
        margin-bottom: 8px;
    }
    
    .form-success p {
        color: #047857;
        margin: 0;
    }
    
    .focus-visible {
        outline: 3px solid var(--color-accent);
        outline-offset: 2px;
    }
    
    .reduce-motion *,
    .reduce-motion *::before,
    .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
    
    .loaded {
        animation: fadeIn 0.6s ease;
    }
`;
document.head.appendChild(style);

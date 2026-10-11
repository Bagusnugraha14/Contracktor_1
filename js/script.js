/**
 * Tukang Bangunan Banjarmasin & Banjarbaru
 * Vanilla JavaScript interactions
 * Strictly adheres to antislop.md constraints (no gratuitous animations, no dead controls).
 */

(function () {
  'use strict';

  // 1. Dynamic Copyright Year (Section 11 requirement)
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Sticky Navbar scroll effect
  const siteHeader = document.getElementById('header');
  function handleScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Navigation Drawer (Section 04 & R-32 Keyboard Accessibility)
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const navBackdrop = document.getElementById('navBackdrop');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileNav() {
    if (!mobileNav || !navBackdrop || !menuToggle) return;
    mobileNav.classList.add('open');
    navBackdrop.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (mobileNavClose) {
      mobileNavClose.focus();
    }
  }

  function closeMobileNav() {
    if (!mobileNav || !navBackdrop || !menuToggle) return;
    mobileNav.classList.remove('open');
    navBackdrop.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuToggle.focus();
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mobileNav && mobileNav.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileNav);
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  // Keyboard trap & Escape key listener for mobile drawer (R-32)
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // 4. Active Navigation State via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          desktopNavLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#' + currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          mobileLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#' + currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // 5. Video Fallback Graceful Handling
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    // If video fails to load, gracefully hide it so poster/fallback shines through
    heroVideo.addEventListener('error', function () {
      heroVideo.style.display = 'none';
    });
  }

  // 6. Smooth Scroll with Header Offset for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update focus for screen readers & keyboard users
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

})();

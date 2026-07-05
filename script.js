document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STICKY HEADER TRANSITION ON SCROLL
  // ==========================================
  const header = document.getElementById('site-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page starts scrolled

  // ==========================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    
    // Animate hamburger to 'X' state
    const spans = mobileToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(8px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  });

  // ==========================================
  // ACTIVE NAVIGATION LINK INTERSECTION OBSERVER
  // ==========================================
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies mid-screen
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            // Only remove active if it's pointing to a section (let's talk button is handled differently)
            if (href.startsWith('#') && href !== '#contact') {
              link.classList.remove('active');
            }
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // ==========================================
  // ELEGANT CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-inquiry-form');
  const submitBtn = document.getElementById('contact-submit');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation check
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      
      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      // Visual feedback for premium experience
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'TRANSMITTING INQUIRY...';
      submitBtn.style.letterSpacing = '0.2em';
      submitBtn.style.opacity = '0.7';

      // Prepare form data for Web3Forms
      const formData = new FormData(contactForm);
      formData.append('access_key', '852e4cfc-f156-4c4c-b278-c1f805e1b620');
      formData.append('subject', 'New Inquiry from Magnorai Studio website');
      formData.append('from_name', 'Magnorai Inquiry Form');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        const json = await response.json();
        if (response.status === 200) {
          submitBtn.textContent = 'INQUIRY SECURED ✓';
          submitBtn.style.backgroundColor = '#2E7D32'; // Successful green
          submitBtn.style.boxShadow = '0 4px 20px rgba(46, 125, 50, 0.2)';
          contactForm.reset();
        } else {
          console.error('Web3Forms Error:', json);
          submitBtn.textContent = 'TRANSMISSION FAILED';
          submitBtn.style.backgroundColor = '#D32F2F'; // Failed red
          submitBtn.style.boxShadow = '0 4px 20px rgba(211, 47, 47, 0.2)';
          alert(json.message || 'Something went wrong. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Submission Error:', error);
        submitBtn.textContent = 'TRANSMISSION FAILED';
        submitBtn.style.backgroundColor = '#D32F2F'; // Failed red
        submitBtn.style.boxShadow = '0 4px 20px rgba(211, 47, 47, 0.2)';
        alert('Form submission failed. Please check your internet connection and try again.');
      })
      .finally(() => {
        // Restore button state after some time
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.boxShadow = '';
          submitBtn.style.letterSpacing = '';
          submitBtn.style.opacity = '';
        }, 4000);
      });
    });
  }

  // ==========================================
  // SMOOTH ANCHOR LINK OFFSET SCROLL
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.15
  };

  const revealObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);
  revealElements.forEach(el => revealObserver.observe(el));
});

/* ============================================
   RAJPUT TOURS & TRAVELS — INTERACTIVE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── NAVBAR SCROLL EFFECT ───
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('.section');
    const allNavLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile nav toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ─── SMOOTH SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── SCROLL REVEAL (IntersectionObserver) ───
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for siblings
                const siblings = entry.target.parentElement.querySelectorAll('.reveal-up');
                let delay = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) delay = i * 80;
                });
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── PARALLAX EFFECT ───
    const hero = document.querySelector('.hero');
    const heroVideo = document.getElementById('heroVideo');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            const parallaxOffset = scrolled * 0.4;
            if (heroVideo) {
                heroVideo.style.transform = `translateY(${parallaxOffset}px) scale(1.05)`;
            }
        }
    });

    // ─── REAL VISITOR COUNT ───
    const visitorCountEl = document.getElementById('realVisitorCount');
    if (visitorCountEl) {
        // Fetch real visit count from a free anonymous counter API
        // It automatically increments the count every time this endpoint is hit.
        fetch('https://api.counterapi.dev/v1/rajputtours/travelportfolio/up')
            .then(response => response.json())
            .then(data => {
                if (data && data.count) {
                    visitorCountEl.setAttribute('data-target', data.count);
                }
            })
            .catch(err => {
                // Fallback to local storage if API fails
                let count = localStorage.getItem('rajput_visits');
                if (!count) {
                    count = 1;
                } else {
                    count = parseInt(count) + 1;
                }
                localStorage.setItem('rajput_visits', count);
                visitorCountEl.setAttribute('data-target', count);
            });
    }

    // ─── COUNTER ANIMATION ───
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    };
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ─── CARD TILT EFFECT ───
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -6;
            const rotateY = (x - centerX) / centerX * 6;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // ─── DESTINATION MODAL ───
    const modal = document.getElementById('destinationModal');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalLocation = document.getElementById('modalLocation');
    const modalDesc = document.getElementById('modalDesc');
    const modalHighlights = document.getElementById('modalHighlights');
    const modalCta = document.getElementById('modalCta');
    const destCards = document.querySelectorAll('.destination-card');

    destCards.forEach(card => {
        card.addEventListener('click', () => {
            const dest = card.getAttribute('data-dest');
            const title = card.getAttribute('data-title');
            const location = card.getAttribute('data-location');
            const desc = card.getAttribute('data-desc');
            const highlights = card.getAttribute('data-highlights').split(',');

            modalImage.src = `images/${dest}.png`;
            modalImage.alt = title;
            modalTitle.textContent = title;
            modalLocation.textContent = `📍 ${location}`;
            modalDesc.textContent = desc;

            modalHighlights.innerHTML = highlights.map(h =>
                `<span class="modal-highlight-tag">${h.trim()}</span>`
            ).join('');

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close modal on CTA click
    modalCta.addEventListener('click', () => {
        closeModal();
    });

    // ─── GALLERY LIGHTBOX ───
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const galleryImages = [];
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay span');
        galleryImages.push({
            src: img.src,
            alt: img.alt,
            caption: caption ? caption.textContent : ''
        });
    });

    let currentGalleryIndex = 0;

    function openLightbox(index) {
        currentGalleryIndex = index;
        lightboxImage.src = galleryImages[index].src;
        lightboxImage.alt = galleryImages[index].alt;
        lightboxCaption.textContent = galleryImages[index].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
        lightboxImage.style.opacity = '0';
        lightboxImage.style.transform = 'scale(0.95)';
        setTimeout(() => {
            lightboxImage.src = galleryImages[currentGalleryIndex].src;
            lightboxImage.alt = galleryImages[currentGalleryIndex].alt;
            lightboxCaption.textContent = galleryImages[currentGalleryIndex].caption;
            lightboxImage.style.opacity = '1';
            lightboxImage.style.transform = 'scale(1)';
        }, 200);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') closeModal();
        }
    });

    // ─── TESTIMONIALS AUTO-SCROLL (duplicate cards for infinite loop) ───
    const track = document.getElementById('testimonialsTrack');
    if (track) {
        const cards = track.innerHTML;
        track.innerHTML = cards + cards; // Duplicate for seamless loop
    }

    // ─── CONTACT FORM ───
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const interest = document.getElementById('formInterest').value || 'General Inquiry';
            const message = document.getElementById('formMessage').value.trim();

            if (!name || (!email && !message)) return;

            // Format WhatsApp Message
            const whatsappNumber = '918446338462';
            const text = `Hi Yash,\n\nI would like to book a trip or get a quote.\n\n*Name:* ${name}\n*Email:* ${email}\n*Interest:* ${interest}\n*Message:* ${message}`;
            const encodedText = encodeURIComponent(text);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

            // Navigate directly to WhatsApp to avoid popup blockers
            window.location.href = whatsappUrl;

            // Show success message locally
            contactForm.innerHTML = `
                <div class="form-success">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <h3>Connecting to WhatsApp...</h3>
                    <p>Thank you, ${name}! If WhatsApp didn't open automatically, please message us at +91 8446338462.</p>
                </div>
            `;
        });
    }

    // ─── FLEET TABS ───
    const fleetTabs = document.querySelectorAll('.fleet-tab');
    const fleetCards = document.querySelectorAll('.fleet-card');

    fleetTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');

            // Update active tab
            fleetTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter cards
            fleetCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

});

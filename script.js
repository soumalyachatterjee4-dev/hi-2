// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Initial State Setup
    gsap.set('.logo', { y: -50, opacity: 0 });
    gsap.set('.navbar', { y: -50, opacity: 0 });
    gsap.set('.text-bg-row', { opacity: 0 });

    // Timeline for Page Load
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // header drop in
    tl.to('.logo', { y: 0, opacity: 1, duration: 1 })
        .to('.navbar', { y: 0, opacity: 1, duration: 1 }, "-=0.8")

        // bg rows fade in subtly
        .to('.text-bg-row', {
            opacity: 1,
            duration: 2,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.5");

    // Horizontal Scrolling Rows
    const rows = document.querySelectorAll('.text-bg-row');
    rows.forEach((row, index) => {
        // 0, 2, 4 go left (-1), 1, 3 go right (1)
        const direction = index % 2 === 0 ? -1 : 1;

        // Items are duplicated 2x in HTML, so moving 50% gives a seamless loop
        if (direction === 1) {
            gsap.set(row, { xPercent: -50 });
        }

        gsap.to(row, {
            xPercent: direction === -1 ? -50 : 0,
            ease: "none",
            duration: 60, // Slowing down the scrolling speed
            repeat: -1
        });
    });

    // Smooth Scrolling for Navbar Links
    const navLinks = document.querySelectorAll('.nav-link');

    // Update active dot on scroll
    const sections = ['home', 'features', 'about', 'contact'];

    sections.forEach((id, index) => {
        const section = document.getElementById(id);
        if (!section) return;

        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onToggle: self => {
                if (self.isActive) {
                    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
                    document.querySelectorAll('.nav-links li')[index].classList.add('active');
                }
            }
        });
    });

    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            gsap.to(window, {
                duration: 1,
                scrollTo: targetId,
                ease: "power3.inOut"
            });
        });
    });
});

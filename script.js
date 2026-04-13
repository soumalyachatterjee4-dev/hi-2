// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- Loading Screen ---
    const loaderText = document.getElementById('loader-text');
    const loaderLine = document.getElementById('loader-line');
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderPercent = document.getElementById('loader-percent');

    // Prevent scroll while loading
    document.body.style.overflow = 'hidden';

    const chars = document.querySelectorAll('#loader-text .char');
    const remainingGreetings = ['Hola', 'Bonjour', 'Hallo', 'Ciao', '你好', 'こんにちは', 'नमस्ते'];

    // Set initial states
    gsap.set(loaderLine, { scaleX: 0 });
    gsap.set(chars, { opacity: 0, y: 20 });

    const loaderTl = gsap.timeline({
        onComplete: () => {
            gsap.timeline()
                .to([loaderText, loaderLine], {
                    opacity: 0,
                    y: -30,
                    duration: 0.4,
                    ease: 'power3.in',
                    stagger: 0.05
                })
                .to(loader, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: 'power4.inOut',
                    onComplete: () => {
                        loader.remove();
                        document.body.style.overflow = '';
                        startPageAnimations();
                    }
                });
        }
    });

    // Step 1: Line scales in
    loaderTl.to(loaderLine, { scaleX: 1, duration: 0.5, ease: 'power2.out' });

    // Step 2: HELLO — each character appears one by one + start loading bar
    loaderTl.add('greetingsStart');
    chars.forEach((char, i) => {
        loaderTl.to(char, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        }, i === 0 ? '+=0.1' : '-=0.05');
    });

    // Hold HELLO briefly, then fade out
    loaderTl
        .to(loaderText, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '+=0.5');

    // Step 3: Remaining greetings — wash out transition
    remainingGreetings.forEach((word) => {
        loaderTl
            .call(() => { loaderText.textContent = word; })
            .set(loaderText, { opacity: 0, filter: 'blur(0px)', scale: 1 })
            .to(loaderText, { opacity: 1, duration: 0.2, ease: 'power2.out' })
            .to(loaderText, {
                opacity: 0,
                scale: 1.3,
                filter: 'blur(12px)',
                duration: 0.35,
                ease: 'power1.in'
            }, '+=0.1');
    });

    // Add end label and attach loading bar from greetingsStart to greetingsEnd
    loaderTl.add('greetingsEnd');
    const greetingsDuration = loaderTl.labels['greetingsEnd'] - loaderTl.labels['greetingsStart'];
    const progress = { value: 0 };
    loaderTl.to(loaderBar, { width: '100%', duration: greetingsDuration, ease: 'none' }, 'greetingsStart');
    loaderTl.to(progress, {
        value: 100,
        duration: greetingsDuration,
        ease: 'none',
        onUpdate: () => {
            loaderPercent.textContent = Math.round(progress.value) + '%';
        }
    }, 'greetingsStart');

    function startPageAnimations() {
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
    const sections = ['home', 'features', 'about', 'portfolio', 'contact'];

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

    // ===== Feature Cards — 3D Carousel (CSS-driven) =====

    } // end startPageAnimations

    /* ── CUSTOM CURSOR ── */
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursor-ring');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
    });

    // Ring follows with smooth lag
    (function animRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animRing);
    })();

    // Expand on hover over links / buttons / cards
    document.querySelectorAll('a, button, .pill, .card, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // ── Ticker ──
    const tickerItems = [
        "Websites Built in 48 Hours",
        "Small Businesses, Big Results",
        "One Price. One Week. Live.",
        "US Service Businesses Only",
        "Closed on Live Video Call",
        "Every Site Ranked & Ready",
        "From Outdated to Outstanding",
        "Built to Convert, Not Just Look Good",
    ];
    const tickerTrack = document.getElementById('ticker-track');
    if (tickerTrack) {
        const tickerHTML = tickerItems.map(t =>
            `<span class="ticker-item">${t}</span><span class="ticker-sep">/</span>`
        ).join('');
        tickerTrack.innerHTML = tickerHTML + tickerHTML;
    }

    // ── Scroll-reveal statement ──
    const revealSentence = "Punchy & Direct US service businesses lose leads every day to a website that doesn't convert. We rebuild it in 48 hours, close the deal on a live video call, and hand it over running — not sitting in a draft folder collecting dust.";
    const revealContainer = document.getElementById('reveal-text');
    if (revealContainer) {
        const revealWords = revealSentence.split(' ');
        revealWords.forEach((word, i) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = (i === 0 ? '' : ' ') + word;
            revealContainer.appendChild(span);
        });

        const allWords = revealContainer.querySelectorAll('.word');

        function onRevealScroll() {
            const rect = revealContainer.getBoundingClientRect();
            const windowH = window.innerHeight;
            const progress = Math.min(1, Math.max(0,
                (windowH * 0.88 - rect.top) / (windowH * 0.78 - windowH * 0.1 + rect.height)
            ));
            const litCount = Math.floor(progress * allWords.length);
            allWords.forEach((w, i) => {
                w.classList.toggle('lit', i < litCount);
            });
        }

        window.addEventListener('scroll', onRevealScroll);
        onRevealScroll();
    }

    // ── Portfolio Preview Hover ──
    const portfolioPreviews = [
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2ODAiIGhlaWdodD0iNDIwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzFhMWExYSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzExMSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI2ODAiIGhlaWdodD0iNDIwIiBmaWxsPSJ1cmwoI2JnKSIvPjxyZWN0IHg9IjM4MCIgeT0iMCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0MjAiIGZpbGw9IiMyMjIiIG9wYWNpdHk9Ii40Ii8+PHRleHQgeD0iNDQwIiB5PSIyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMWUxZTFlIj4wMTwvdGV4dD48cmVjdCB4PSI1MCIgeT0iMTYwIiB3aWR0aD0iNCIgaGVpZ2h0PSIxMTAiIHJ4PSIyIiBmaWxsPSIjRTg1MDBBIi8+PHRleHQgeD0iNzIiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiI+UmVwYWlyPC90ZXh0Pjx0ZXh0IHg9IjcyIiB5PSIyNDgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNFODUwMEEiPlNlcnZpY2U8L3RleHQ+PHRleHQgeD0iNzIiIHk9IjI5NiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiI+QnVzaW5lc3M8L3RleHQ+PHJlY3QgeD0iNzIiIHk9IjMyMCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzOCIgcng9IjQiIGZpbGw9IiNFODUwMEEiLz48dGV4dCB4PSI5MiIgeT0iMzQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiPkNhbGwgdG8gYWN0aW9uPC90ZXh0PjxjaXJjbGUgY3g9IjUyMCIgY3k9IjE4MCIgcj0iMTAwIiBmaWxsPSIjRTg1MDBBIiBvcGFjaXR5PSIuMTUiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii43Ij5MT0dPPC90ZXh0Pjx0ZXh0IHg9IjM1MCIgeT0iNDYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMSIgZmlsbD0iIzg4OCI+SE9NRSAgIEFCT1VUICAgU0VSVklDRSAgIEJMT0cgICBDT05UQUNUPC90ZXh0Pjwvc3ZnPg==',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2ODAiIGhlaWdodD0iNDIwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2U4ZTBmMCIvPjxzdG9wIG9mZnNldD0iNDAlIiBzdG9wLWNvbG9yPSIjZDVjZmU4Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOGI5ZmQwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9IndhdmUiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjYzlhMGRjIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjN2ViNGQyIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjY4MCIgaGVpZ2h0PSI0MjAiIGZpbGw9InVybCgjYmcpIi8+PHBhdGggZD0iTTM1MCAwUTQ1MCA4MCA1NTAgNTBRNjUwIDIwIDY4MCA4MFY0MjBIMzUwWiIgZmlsbD0iIzZhODBiOCIgb3BhY2l0eT0iLjUiLz48cGF0aCBkPSJNNDAwIDBRNDgwIDEyMCA2MDAgNjBMNjgwIDBaIiBmaWxsPSJ1cmwoI3dhdmUpIiBvcGFjaXR5PSIuNiIvPjxyZWN0IHg9IjM0MCIgeT0iMTIwIiB3aWR0aD0iMzQwIiBoZWlnaHQ9IjMwMCIgcng9IjAiIGZpbGw9IiM0YTYwOTAiIG9wYWNpdHk9Ii4zIi8+PGVsbGlwc2UgY3g9IjUwMCIgY3k9IjMwMCIgcng9IjE4MCIgcnk9IjE4MCIgZmlsbD0iIzVjM2Q4ZiIgb3BhY2l0eT0iLjIiLz48cmVjdCB4PSI1MCIgeT0iMTUwIiB3aWR0aD0iNjAiIGhlaWdodD0iMyIgcng9IjEiIGZpbGw9IiM4YjZhYWQiLz48dGV4dCB4PSI1MCIgeT0iMjEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjgiIGZpbGw9IiMzMzMiPllPVVIgPHRzcGFuIGZvbnQtd2VpZ2h0PSJib2xkIj5XT1JLU1BBQ0U8L3RzcGFuPjwvdGV4dD48dGV4dCB4PSI1MCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjgiIGZpbGw9IiM1NTUiIGZvbnQtd2VpZ2h0PSIzMDAiPkxBTkRJTkcgUEFHRVM8L3RleHQ+PHRleHQgeD0iNTAiIHk9IjI5MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjODg4Ij5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LjwvdGV4dD48cmVjdCB4PSI1MCIgeT0iMzMwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjM4IiByeD0iMTkiIGZpbGw9IiNiOGEwZDgiIG9wYWNpdHk9Ii43Ii8+PHRleHQgeD0iNzIiIHk9IjM1NCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEzIiBmaWxsPSIjZmZmIj5HZXQgU3RhcnRlZDwvdGV4dD48dGV4dCB4PSI1MCIgeT0iNDQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzU1NSI+WU9VUiA8dHNwYW4gZm9udC13ZWlnaHQ9ImJvbGQiPkxPR088L3RzcGFuPjwvdGV4dD48dGV4dCB4PSIyODAiIHk9IjQ0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM3NzciPkhvbWUgICBBYm91dCBVcyAgIFNlcnZpY2VzICAgQ29udGFjdCBVczwvdGV4dD48L3N2Zz4=',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2ODAiIGhlaWdodD0iNDIwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImJnIiBjeD0iNTAlIiBjeT0iNTAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGExYThhIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMmEwZTVhIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjY4MCIgaGVpZ2h0PSI0MjAiIGZpbGw9InVybCgjYmcpIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2M4YTAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9Ii41Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSI0MDAiIHI9IjQwIiBmaWxsPSIjZDRhMDE3IiBvcGFjaXR5PSIuNiIvPjxwYXRoIGQ9Ik01ODAgMEw2ODAgMEw2ODAgMTAwWiIgZmlsbD0iI2Q0YTAxNyIvPjxwYXRoIGQ9Ik02MjAgMEw2ODAgMEw2ODAgNjBaIiBmaWxsPSIjZTg1MDMwIi8+PGVsbGlwc2UgY3g9IjYyMCIgY3k9IjM4MCIgcng9IjYwIiByeT0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2M4YTAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIuNCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNjY2MiIGZvbnQtd2VpZ2h0PSIzMDAiPldFIEFSRTwvdGV4dD48dGV4dCB4PSIxNTAiIHk9IjIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjYwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZmZmIj5DUkVBVElWRTwvdGV4dD48dGV4dCB4PSIxNTAiIHk9IjI4NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjYwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZDRhMDE3Ij5BR0VOQ1k8L3RleHQ+PHJlY3QgeD0iMTUwIiB5PSIyOTgiIHdpZHRoPSIyNjAiIGhlaWdodD0iMjQiIHJ4PSI0IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIuMTUiLz48dGV4dCB4PSIxNjAiIHk9IjMxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIj5IYXZlIGFuIDx0c3BhbiBmaWxsPSIjZDRhMDE3Ij5JZGVhPC90c3Bhbj4gb3IgPHRzcGFuIGZpbGw9IiNlODUwMzAiPlByb2plY3Q8L3RzcGFuPj88L3RleHQ+PHRleHQgeD0iMTUwIiB5PSIzNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2FhYSI+TG9yZW0gSXBzdW0gaXMgc2ltcGx5IGR1bW15IHRleHQgb2YgdGhlIHByaW50aW5nIGluZHVzdHJ5LjwvdGV4dD48cmVjdCB4PSIxNTAiIHk9IjM3OCIgd2lkdGg9IjExMCIgaGVpZ2h0PSIzNCIgcng9IjQiIGZpbGw9IiNFODUwMEEiLz48dGV4dCB4PSIxNzAiIHk9IjQwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEzIiBmaWxsPSIjZmZmIj5DT05UQUNUIFVTPC90ZXh0Pjwvc3ZnPg==',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2ODAiIGhlaWdodD0iNDIwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzFhMGEzZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzNhMTA3MCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiZWFtIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmODBmZiIvPjxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmY4MGZmIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjY4MCIgaGVpZ2h0PSI0MjAiIGZpbGw9InVybCgjYmcpIi8+PHBvbHlnb24gcG9pbnRzPSI0ODAsMCA1NjAsNDIwIDQ0MCw0MjAiIGZpbGw9InVybCgjYmVhbSkiIG9wYWNpdHk9Ii43Ii8+PHBvbHlnb24gcG9pbnRzPSI0OTAsMCA1NDAsNDIwIDQ1MCw0MjAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii40Ii8+PHRleHQgeD0iNjAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNjYzgwY2MiIGZvbnQtd2VpZ2h0PSIzMDAiIGxldHRlci1zcGFjaW5nPSI4Ij5IT01FICAgIEJMT0cgICAgQ09OVEFDVFM8L3RleHQ+PHRleHQgeD0iNjAiIHk9IjI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjU2IiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZmZmIj5PVkVSQ09NSU5HPC90ZXh0Pjx0ZXh0IHg9IjYwIiB5PSIzMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4OCI+TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyPC90ZXh0Pjx0ZXh0IHg9IjYwIiB5PSIzMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4OCI+ZWxpdC4gRXRpYW0gcmhvbmN1cywgdmVsaXQgdmVsIGxhY2luaWEgY29tbW88L3RleHQ+PHJlY3QgeD0iNjAiIHk9IjM3MCIgd2lkdGg9IjExMCIgaGVpZ2h0PSIzOCIgcng9IjE5IiBmaWxsPSJub25lIiBzdHJva2U9IiNlMDgwZTAiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHRleHQgeD0iODIiIHk9IjM5NCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZTA4MGUwIj5Mb2dpbjwvdGV4dD48cmVjdCB4PSIxOTAiIHk9IjM3MCIgd2lkdGg9IjExMCIgaGVpZ2h0PSIzOCIgcng9IjE5IiBmaWxsPSIjZmY4MGZmIiBvcGFjaXR5PSIuNiIvPjx0ZXh0IHg9IjIxMCIgeT0iMzk0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiPlNpZ24gVXA8L3RleHQ+PC9zdmc+',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2ODAiIGhlaWdodD0iNDIwIj48cmVjdCB3aWR0aD0iNjgwIiBoZWlnaHQ9IjQyMCIgZmlsbD0iI2Y1OWUwYiIvPjxyZWN0IHg9IjAiIHk9IjMwMCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiMxMGI5ODEiIHJ4PSIwIi8+PHJlY3QgeD0iNDYwIiB5PSIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEwMCIgcng9IjAiIGZpbGw9IiM3YzNhZWQiLz48cmVjdCB4PSI1MjAiIHk9IjYwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEwMCIgcng9IjAiIGZpbGw9IiNlZjQ0NDQiLz48Y2lyY2xlIGN4PSI0ODAiIGN5PSIyMDAiIHJ4PSIyMCIgcnk9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlZjQ0NDQiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjQwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iI2ZmZiI+U21hcnQgSWRlYTwvdGV4dD48dGV4dCB4PSI0MCIgeT0iMjM1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IiNmZmYiPkZvciBZb3VyIEJyYW5kPC90ZXh0Pjx0ZXh0IHg9IjQwIiB5PSIyOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iI2ZmZiI+QXJlIEhlcmUuPC90ZXh0Pjx0ZXh0IHg9IjQwIiB5PSIzMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjgiPkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuPC90ZXh0PjxyZWN0IHg9IjQwIiB5PSIzNTUiIHdpZHRoPSIxMDAiIGhlaWdodD0iMzQiIHJ4PSIxNyIgZmlsbD0iIzdjM2FlZCIvPjx0ZXh0IHg9IjU2IiB5PSIzNzciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiI+TGVhcm4gTW9yZTwvdGV4dD48cmVjdCB4PSIxNTUiIHk9IjM1NSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIzNCIgcng9IjE3IiBmaWxsPSIjZWY0NDQ0Ii8+PHRleHQgeD0iMTc0IiB5PSIzNzciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiI+T3VyIENsaWVudDwvdGV4dD48dGV4dCB4PSI1NSIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmYiPkNyZWF0aXZlPC90ZXh0Pjx0ZXh0IHg9IjE0MCIgeT0iNDgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiIgdGV4dC1kZWNvcmF0aW9uPSJ1bmRlcmxpbmUiPkhvbWU8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIj5TZXJ2aWNlPC90ZXh0Pjx0ZXh0IHg9IjI3MCIgeT0iNDgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiI+UHJpY2U8L3RleHQ+PHRleHQgeD0iMzIwIiB5PSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIj5BYm91dDwvdGV4dD48dGV4dCB4PSIzNzUiIHk9IjQ4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiPkNvbnRhY3Q8L3RleHQ+PC9zdmc+'
    ];

    const pCard = document.getElementById('previewCard');
    const pImg = document.getElementById('previewImg');
    const pItems = document.querySelectorAll('.project-item');

    if (pCard && pImg && pItems.length) {
        let pMouseX = 0, pMouseY = 0;
        let pCardX = 0, pCardY = 0;
        let pRaf = null;

        function pLerp(a, b, t) { return a + (b - a) * t; }

        function pAnimate() {
            pCardX = pLerp(pCardX, pMouseX, 0.12);
            pCardY = pLerp(pCardY, pMouseY, 0.12);
            const offsetX = pMouseX > window.innerWidth / 2 ? -370 : 30;
            const offsetY = -105;
            pCard.style.left = (pCardX + offsetX) + 'px';
            pCard.style.top  = (pCardY + offsetY) + 'px';
            pRaf = requestAnimationFrame(pAnimate);
        }

        pAnimate();

        document.addEventListener('mousemove', (e) => {
            pMouseX = e.clientX;
            pMouseY = e.clientY;
        });

        pItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                const idx = parseInt(item.dataset.index);
                pImg.src = portfolioPreviews[idx];
                pCard.classList.add('visible');
            });
            item.addEventListener('mouseleave', () => {
                pCard.classList.remove('visible');
            });
        });
    }
});

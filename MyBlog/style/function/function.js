(function () {
    /**
     * Sets the text content of the element with ID 'current-year' to the current full year.
     */
    function setCurrentYear() {
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Manages the active state for the sidebar navigation.
     */
    function initializeSidebarNav() {
        const sidebarNav = document.querySelector('.sidebar-nav');
        if (!sidebarNav) {
            return; // No sidebar navigation found on this page.
        }

        const navItems = Array.from(sidebarNav.querySelectorAll('.nav-item'));
        const ACTIVE_CLASS = 'is-active';

        /**
         * Normalizes a URL path for consistent comparison.
         * - Replaces backslashes with forward slashes.
         * - Removes trailing 'index.html'.
         * - Removes trailing slashes.
         * @param {string} path The path to normalize.
         * @returns {string} The normalized path.
         */
        const normalizePath = (path) => {
            return (
                path
                    .replace(/\\/g, '/')
                    .replace(/index\.html$/i, '')
                    .replace(/\/+$/, '') || '/'
            );
        };

        /**
         * Sets a specific navigation item as active and deactivates all others.
         * @param {Element} targetItem The navigation item to activate.
         */
        const setActiveItem = (targetItem) => {
            navItems.forEach((item) => {
                item.classList.toggle(ACTIVE_CLASS, item === targetItem);
            });
        };

        /**
         * Finds the navigation item that corresponds to the current page URL.
         * @returns {Element | undefined} The matching navigation item.
         */
        function findActiveItem() {
            const currentPath = normalizePath(window.location.pathname);
            const currentHash = window.location.hash || '';

            // 1. Try to find a direct match based on URL path and hash.
            const directMatch = navItems.find((item) => {
                const link = item.querySelector('a');
                if (!link) return false;

                const url = new URL(link.href); // Use link.href for absolute URL
                const linkPath = normalizePath(url.pathname);
                const linkHash = url.hash || '';

                // If the link has a hash, it must match the current hash.
                if (linkHash) {
                    return linkPath === currentPath && linkHash === currentHash;
                }

                // If the link has no hash, it should only match if there's no current hash.
                return linkPath === currentPath && !currentHash;
            });

            if (directMatch) {
                return directMatch;
            }

            // 2. Fallback: Try to find a match using the 'data-page' attribute on the body.
            const pageTag = (document.body.dataset.page || '').trim();
            if (pageTag) {
                return navItems.find((item) => {
                    const itemPages = (item.dataset.page || '')
                        .split(',')
                        .map((value) => value.trim());
                    return itemPages.includes(pageTag);
                });
            }

            return undefined;
        }

        // Set the initial active item on page load.
        const activeItem = findActiveItem();
        if (activeItem) {
            setActiveItem(activeItem);
        }

        // Add click listeners to update the active state when navigating.
        navItems.forEach((item) => {
            const link = item.querySelector('a');
            if (link) {
                link.addEventListener('click', () => setActiveItem(item));
            }
        });
    }

    /**
     * Manages the mobile navigation toggle and sidebar state.
     */
    function initializeMobileNav() {
        // 1. Create and inject the toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-nav-toggle';
        toggleBtn.ariaLabel = 'Otvoriť menu';
        toggleBtn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
        `;
        document.body.appendChild(toggleBtn);

        // 2. Create and inject the overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        document.body.appendChild(overlay);

        // 3. Get the sidebar
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        // 4. Toggle logic
        function toggleMenu() {
            const isOpen = sidebar.classList.contains('is-open');

            if (isOpen) {
                sidebar.classList.remove('is-open');
                overlay.classList.remove('is-visible');
                toggleBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                    </svg>
                `;
            } else {
                sidebar.classList.add('is-open');
                overlay.classList.add('is-visible');
                toggleBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                `;
            }
        }

        toggleBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        const navLinks = sidebar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (sidebar.classList.contains('is-open')) {
                    toggleMenu();
                }
            });
        });
    }

    /**
     * Initializes the scroll reveal animation using IntersectionObserver.
     */
    function initializeScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }

    /**
     * Initializes the typing effect for the hero section.
     */
    /**
     * Initializes the typing effect for the hero section.
     */
    function initializeTypingEffect() {
        // Target H1 in hero, page-hero, or project-header
        const heroTitle = document.querySelector('.hero h1, .page-hero h1, .project-header h1');
        if (!heroTitle) return;

        // Get the original text content
        const text = heroTitle.textContent.trim();

        // Clear content initially
        heroTitle.textContent = "";
        heroTitle.classList.add('typing-cursor');

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after a delay
                setTimeout(() => {
                    heroTitle.classList.remove('typing-cursor');
                }, 2000);
            }
        };

        // Start typing after a small delay
        setTimeout(typeWriter, 500);
    }

    // Initialize all functionalities.
    setCurrentYear();
    initializeSidebarNav();
    initializeMobileNav();
    initializeScrollReveal();
    initializeTypingEffect();
})();

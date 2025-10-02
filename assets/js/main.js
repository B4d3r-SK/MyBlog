const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.main-nav ul');
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
const yearEl = document.getElementById('year');

if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

        projectCards.forEach((card) => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            card.style.display = shouldShow ? 'flex' : 'none';
        });
    });
});

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

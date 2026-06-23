window.addEventListener('load', function() {
    // Script pour le menu burger
    const BurgerMenuButton = document.querySelector('.burger-menu-button');
    const BurgerMenuButtonIcon = document.querySelector('.burger-menu-button i');
    const BurgerMenu = document.querySelector('.burger-menu');

    if (BurgerMenuButton && BurgerMenuButtonIcon && BurgerMenu) {
        BurgerMenuButton.addEventListener('click', function() {
            BurgerMenu.classList.toggle('open');
            const isOpen = BurgerMenu.classList.contains('open');
            BurgerMenuButtonIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });
    }

    // Script pour les modales
    const welcomeModal = document.getElementById('welcomeModal');
    const legalModal = document.getElementById('legalModal');
    const legalLink = document.getElementById('legalLink');

    function openModal(modal) {
        if (!modal) return;
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.add('hidden');
        if (document.querySelectorAll('.modal:not(.hidden)').length === 0) {
            document.body.classList.remove('modal-open');
        }
    }

    if (welcomeModal) {
        const welcomeCloseButtons = welcomeModal.querySelectorAll('.modal-close, .modal-btn');

        setTimeout(() => {
            openModal(welcomeModal);
        }, 500);

        welcomeCloseButtons.forEach(button => {
            button.addEventListener('click', () => {
                closeModal(welcomeModal);
            });
        });

        welcomeModal.addEventListener('click', function(event) {
            if (event.target === welcomeModal) {
                closeModal(welcomeModal);
            }
        });
    }

    if (legalModal && legalLink) {
        const legalCloseButtons = legalModal.querySelectorAll('.modal-close, .modal-btn');

        legalLink.onclick = function(event) {
            event.preventDefault();
            openModal(legalModal);
            return false;
        };

        legalCloseButtons.forEach(button => {
            button.addEventListener('click', () => {
                closeModal(legalModal);
            });
        });

        legalModal.addEventListener('click', function(event) {
            if (event.target === legalModal) {
                closeModal(legalModal);
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    if (contactForm && formSuccess && formError) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            formSuccess.classList.remove('show');
            formError.classList.remove('show');

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Une erreur est survenue.');
                }

                formSuccess.textContent = result.message;
                formSuccess.classList.add('show');
                contactForm.reset();
            } catch (error) {
                formError.textContent = error.message;
                formError.classList.add('show');
            }
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                closeModal(modal);
            });
        }
    });
});
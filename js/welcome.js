(function () {
    'use strict';

    var modal = document.getElementById('welcomeModal');
    var closeBtn = document.getElementById('closeWelcomeModal');
    var welcomeBtn = document.getElementById('welcomeBtn');

    function closeModal() {
        if (modal) {
            modal.classList.add('welcome-modal--hidden');
            setTimeout(function () {
                modal.style.display = 'none';
            }, 300);
        }
    }

    function showModal() {
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(function () {
                modal.classList.remove('welcome-modal--hidden');
            }, 10);
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (welcomeBtn) {
        welcomeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal || e.target.classList.contains('welcome-modal-overlay')) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('welcome-modal--hidden')) {
            closeModal();
        }
    });

    showModal();
})();

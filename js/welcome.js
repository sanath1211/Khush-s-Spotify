(function () {
    'use strict';

    var modalClosed = false;

    function initWelcomeModal() {
        var modal = document.getElementById('welcomeModal');
        var closeBtn = document.getElementById('closeWelcomeModal');
        var welcomeBtn = document.getElementById('welcomeBtn');

        if (!modal) {
            console.warn('Welcome modal not found');
            return;
        }

        function closeModal(e) {
            if (e) e.preventDefault();
            if (e) e.stopPropagation();
            if (modal) {
                modalClosed = true;
                modal.classList.add('welcome-modal--hidden');
                modal.setAttribute('data-closed', 'true');
                setTimeout(function () {
                    modal.classList.add('welcome-modal--closed');
                    modal.style.display = 'none';
                }, 400);
            }
        }

        function showModal() {
            if (modal && !modalClosed) {
                modal.removeAttribute('data-closed');
                modal.classList.remove('welcome-modal--closed');
                modal.style.display = 'flex';
                modal.style.opacity = '1';
                modal.style.visibility = 'visible';
                modal.classList.remove('welcome-modal--hidden');
            }
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeModal(e);
            });
        }

        if (welcomeBtn) {
            welcomeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeModal(e);
            });
        }

        if (modal) {
            var overlay = modal.querySelector('.welcome-modal-overlay');
            if (overlay) {
                overlay.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeModal(e);
                });
            }
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeModal(e);
                }
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal && !modal.classList.contains('welcome-modal--hidden')) {
                closeModal();
            }
        });

        showModal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWelcomeModal);
    } else {
        initWelcomeModal();
    }
})();

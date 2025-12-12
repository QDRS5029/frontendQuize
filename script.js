// Управление модальными окнами
document.addEventListener('DOMContentLoaded', function() {
    // Получаем все кнопки, которые открывают модальные окна
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal__close, .modal__cancel');

    // Функция для предотвращения сдвига контента при открытии модального окна
    function preventBodyScroll() {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = scrollbarWidth + 'px';
        }
        document.body.style.overflow = 'hidden';
    }

    function restoreBodyScroll() {
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
    }

    // Открытие модального окна
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(`modal-${modalId}`);
            if (modal) {
                // Для модального окна создания трансляции позиционируем под кнопкой
                if (modalId === 'create-broadcast') {
                    const rect = this.getBoundingClientRect();
                    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                    const modalContent = modal.querySelector('.modal__content--create');
                    if (modalContent) {
                        modalContent.style.left = (rect.left + scrollX) + 'px';
                        modalContent.style.top = (rect.bottom + scrollY + 10) + 'px';
                    }
                }
                //  Модальное окно создания квиза позиционируем по центру кнопки
                if (modalId === 'create-quiz') {
                    const rect = this.getBoundingClientRect();
                    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                    const modalContent = modal.querySelector('.modal__content--create-quiz');
                    if (modalContent) {
                        const buttonCenterX = rect.left + rect.width / 2;
                        const modalWidth = 452;
                        modalContent.style.left = (buttonCenterX - modalWidth / 2 + scrollX) + 'px';
                        modalContent.style.top = (rect.bottom + scrollY + 10) + 'px';
                        modalContent.style.right = 'auto';
                        modalContent.style.transform = 'none';
                    }
                }
                // Модальное окно создания трансляции позиционируем по центру кнопки
                if (modalId === 'create-broadcast-new') {
                    const rect = this.getBoundingClientRect();
                    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                    const modalContent = modal.querySelector('.modal__content--create-quiz');
                    if (modalContent) {
                        const buttonCenterX = rect.left + rect.width / 2;
                        const modalWidth = 452;
                        modalContent.style.left = (buttonCenterX - modalWidth / 2 + scrollX) + 'px';
                        modalContent.style.top = (rect.bottom + scrollY + 10) + 'px';
                        modalContent.style.right = 'auto';
                        modalContent.style.transform = 'none';
                    }
                }
                modal.classList.add('active');
                preventBodyScroll();
            }
        });
    });

    // Закрытие модального окна
    function closeModal(modal) {
        modal.classList.remove('active');
        restoreBodyScroll();
    }

    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Закрытие при клике на overlay или вне модального окна
    modals.forEach(modal => {
        const overlay = modal.querySelector('.modal__overlay');
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeModal(modal);
            });
        }
        // Закрытие при клике на сам modal (вне контента), если overlay скрыт
        modal.addEventListener('click', function(e) {
            // Проверяем, что клик был именно на modal, а не на его содержимое
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });

    // Предотвращение закрытия при клике на содержимое модального окна
    modals.forEach(modal => {
        const content = modal.querySelector('.modal__content');
        if (content) {
            content.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });

    // Управление выпадающими списками
    const dropdownTriggers = document.querySelectorAll('[data-dropdown]');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Открытие/закрытие выпадающих списков
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdownId = this.getAttribute('data-dropdown');
            const dropdown = document.getElementById(`dropdown-${dropdownId}`);

            if (dropdown) {
                // Закрываем все другие выпадающие списки
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
                // Переключаем текущий
                dropdown.classList.toggle('active');
            }
        });
    });

    // Открытие выпадающего списка квизов при клике на "Добавить квиз"
    const addQuizButtons = document.querySelectorAll('[data-modal="add-quiz"]');
    addQuizButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = document.getElementById('dropdown-quiz-list');
            if (dropdown) {
                // Закрываем все другие выпадающие списки
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
                // Позиционируем относительно кнопки с учетом scroll
                const rect = this.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;

                dropdown.style.left = (rect.left + scrollX) + 'px';
                dropdown.style.top = (rect.bottom + scrollY + 10) + 'px';
                dropdown.classList.toggle('active');
            }
        });
    });

    // Закрытие выпадающих списков при клике вне их
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown') && !e.target.closest('[data-dropdown]') && !e.target.closest('[data-modal="add-quiz"]')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Обработка клика на элементы выпадающего списка
    document.querySelectorAll('.dropdown__item, .dropdown__user-item').forEach(item => {
        item.addEventListener('click', function() {
            // Здесь можно добавить логику обработки выбора
            const dropdown = this.closest('.dropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Переключение вкладок навигации
    const navLinks = document.querySelectorAll('.nav__link');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    const tabIndicator = document.querySelector('.tab-indicator');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');

            // Убираем активный класс у всех ссылок
            navLinks.forEach(l => l.classList.remove('nav__link--active'));
            // Добавляем активный класс к текущей ссылке
            this.classList.add('nav__link--active');

            // Скрываем все контенты вкладок
            tabContents.forEach(content => {
                content.style.display = 'none';
            });

            // Показываем выбранный контент
            const activeContent = document.querySelector(`[data-tab-content="${tabId}"]`);
            if (activeContent) {
                activeContent.style.display = 'flex';
            }

            // Обновляем индикатор
            if (tabIndicator) {
                tabIndicator.setAttribute('data-active', tabId);
            }
        });
    });
});


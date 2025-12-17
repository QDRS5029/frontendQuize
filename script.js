// Глобальные функции для управления скроллом
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

// Управление модальными окнами
document.addEventListener('DOMContentLoaded', function() {
    // Получаем все кнопки, которые открывают модальные окна
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal__close, .modal__cancel');

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

    function activateTab(tabId) {
        // Убираем активный класс у всех ссылок
        navLinks.forEach(l => l.classList.remove('nav__link--active'));

        // Добавляем активный класс к нужной ссылке
        const activeLink = document.querySelector(`.nav__link[data-tab="${tabId}"]`);
        if (activeLink) {
            activeLink.classList.add('nav__link--active');
        }

        // Скрываем все контенты вкладок
        tabContents.forEach(content => {
            content.style.display = 'none';
        });

        // Показываем выбранный контент
        const activeContent = document.querySelector(`[data-tab-content="${tabId}"]`);
        if (activeContent) {
            activeContent.style.display = 'flex';

            // Обновляем ширину карточек при переключении вкладок
            if (typeof cardManager !== 'undefined') {
                if (tabId === 'broadcasts') {
                    cardManager.updateCardWidths(cardManager.broadcastsContainer);
                } else if (tabId === 'quizzes') {
                    cardManager.updateCardWidths(cardManager.quizzesContainer);
                } else if (tabId === 'statistics') {
                    cardManager.updateCardWidths(cardManager.statisticsContainer);
                }
            }
        }

        // Обновляем индикатор
        if (tabIndicator) {
            tabIndicator.setAttribute('data-active', tabId);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            window.location.hash = tabId;
            activateTab(tabId);
        });
    });

    // Активируем вкладку в зависимости от hash в URL
    const hash = window.location.hash.replace('#', '');
    if (hash === 'quizzes' || hash === 'statistics' || hash === 'broadcasts') {
        activateTab(hash);
    } else {
        activateTab('broadcasts');
    }
});

// Функции валидации
function validateTitle(title, minLength = 3, maxLength = 100) {
    const trimmed = title.trim();
    if (!trimmed) {
        return { valid: false, message: 'Название обязательно для заполнения' };
    }
    if (trimmed.length < minLength) {
        return { valid: false, message: `Название должно содержать минимум ${minLength} символа` };
    }
    if (trimmed.length > maxLength) {
        return { valid: false, message: `Название не должно превышать ${maxLength} символов` };
    }
    return { valid: true };
}

function validateDescription(description, maxLength = 500) {
    const trimmed = description.trim();
    if (trimmed && trimmed.length > maxLength) {
        return { valid: false, message: `Описание не должно превышать ${maxLength} символов` };
    }
    return { valid: true };
}

// Обновление выпадающего списка "Добавить квиз"
function updateQuizDropdown(quizzes) {
    const dropdown = document.getElementById('dropdown-quiz-list');
    if (!dropdown) return;

    const content = dropdown.querySelector('.dropdown__content');
    if (!content) return;

    content.innerHTML = '';

    quizzes.forEach(quiz => {
        const item = document.createElement('div');
        item.className = 'dropdown__item';
        item.dataset.quizId = quiz.id;
        item.textContent = quiz.title || 'Без названия';
        content.appendChild(item);
    });
}

function validateDate(dateString) {
    if (!dateString) {
        return { valid: false, message: 'Дата обязательна для заполнения' };
    }
    const selectedDate = new Date(dateString);
    const now = new Date();
    now.setSeconds(0, 0); // Убираем секунды и миллисекунды для сравнения

    if (selectedDate < now) {
        return { valid: false, message: 'Дата не может быть в прошлом' };
    }
    return { valid: true };
}

function showFieldError(field, message) {
    field.classList.add('error');
    let errorElement = field.parentElement.querySelector('.form-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearAllErrors(form) {
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => clearFieldError(field));
}

// Инициализация форм модальных окон
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик формы создания квиза
    const createQuizForm = document.querySelector('#modal-create-quiz form');
    if (createQuizForm) {
        const titleInput = createQuizForm.querySelector('input[type="text"]');
        const descriptionInput = createQuizForm.querySelector('textarea');

        // Валидация в реальном времени
        if (titleInput) {
            titleInput.addEventListener('blur', function() {
                const validation = validateTitle(this.value);
                if (!validation.valid) {
                    showFieldError(this, validation.message);
                } else {
                    clearFieldError(this);
                }
            });
            titleInput.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    const validation = validateTitle(this.value);
                    if (validation.valid) {
                        clearFieldError(this);
                    }
                }
            });
        }

        if (descriptionInput) {
            descriptionInput.addEventListener('blur', function() {
                const validation = validateDescription(this.value);
                if (!validation.valid) {
                    showFieldError(this, validation.message);
                } else {
                    clearFieldError(this);
                }
            });
            descriptionInput.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    const validation = validateDescription(this.value);
                    if (validation.valid) {
                        clearFieldError(this);
                    }
                }
            });
        }

        createQuizForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            clearAllErrors(this);

            const title = titleInput.value;
            const description = descriptionInput.value;

            let isValid = true;

            // Валидация названия
            const titleValidation = validateTitle(title);
            if (!titleValidation.valid) {
                showFieldError(titleInput, titleValidation.message);
                isValid = false;
            }

            // Валидация описания
            const descriptionValidation = validateDescription(description);
            if (!descriptionValidation.valid) {
                showFieldError(descriptionInput, descriptionValidation.message);
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            const titleTrimmed = title.trim();
            const descriptionTrimmed = description.trim();

            try {
                let createdQuizId;

                if (typeof apiService !== 'undefined') {
                    // Создаём квиз в бекенде
                    const response = await apiService.createQuiz({
                        title: titleTrimmed,
                        description: descriptionTrimmed,
                    });
                    createdQuizId = response.id;
                } else {
                    // Фоллбек на локальный id, если по какой-то причине apiService недоступен
                    createdQuizId = Date.now();
                }

                // Сохраняем данные квиза для редактора
                localStorage.setItem('editingQuizTitle', titleTrimmed);
                localStorage.setItem('editingQuizDescription', descriptionTrimmed);
                localStorage.setItem('editingQuizId', createdQuizId);

                // Закрываем модальное окно
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    restoreBodyScroll();
                }

                // Очищаем форму и ошибки
                clearAllErrors(this);
                this.reset();

                // Переходим в редактор вопросов
                window.location.href = 'quiz-editor.html?id=' + createdQuizId;
            } catch (error) {
                console.error('Ошибка при создании квиза:', error);
                alert('Ошибка при создании квиза. Попробуйте еще раз.');
            }
        });
    }

    // Обработчик формы создания трансляции
    const createBroadcastForm = document.querySelector('#modal-create-broadcast-new form');
    if (createBroadcastForm) {
        const titleInput = createBroadcastForm.querySelector('input[type="text"]');
        const descriptionInput = createBroadcastForm.querySelector('textarea');
        const dateInput = createBroadcastForm.querySelector('input[type="datetime-local"]');

        // Валидация в реальном времени
        if (titleInput) {
            titleInput.addEventListener('blur', function() {
                const validation = validateTitle(this.value);
                if (!validation.valid) {
                    showFieldError(this, validation.message);
                } else {
                    clearFieldError(this);
                }
            });
            titleInput.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    const validation = validateTitle(this.value);
                    if (validation.valid) {
                        clearFieldError(this);
                    }
                }
            });
        }

        if (descriptionInput) {
            descriptionInput.addEventListener('blur', function() {
                const validation = validateDescription(this.value);
                if (!validation.valid) {
                    showFieldError(this, validation.message);
                } else {
                    clearFieldError(this);
                }
            });
            descriptionInput.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    const validation = validateDescription(this.value);
                    if (validation.valid) {
                        clearFieldError(this);
                    }
                }
            });
        }

        if (dateInput) {
            // Устанавливаем минимальную дату как текущую
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            dateInput.min = now.toISOString().slice(0, 16);

            dateInput.addEventListener('blur', function() {
                const validation = validateDate(this.value);
                if (!validation.valid) {
                    showFieldError(this, validation.message);
                } else {
                    clearFieldError(this);
                }
            });
            dateInput.addEventListener('change', function() {
                if (this.classList.contains('error')) {
                    const validation = validateDate(this.value);
                    if (validation.valid) {
                        clearFieldError(this);
                    }
                }
            });
        }

        createBroadcastForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            clearAllErrors(this);

            const title = titleInput.value;
            const description = descriptionInput.value;
            const date = dateInput ? dateInput.value : null;

            let isValid = true;

            // Валидация названия
            const titleValidation = validateTitle(title);
            if (!titleValidation.valid) {
                showFieldError(titleInput, titleValidation.message);
                isValid = false;
            }

            // Валидация описания
            const descriptionValidation = validateDescription(description);
            if (!descriptionValidation.valid) {
                showFieldError(descriptionInput, descriptionValidation.message);
                isValid = false;
            }

            // Валидация даты
            const dateValidation = validateDate(date);
            if (!dateValidation.valid) {
                if (dateInput) {
                    showFieldError(dateInput, dateValidation.message);
                }
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            const broadcastData = {
                title: title.trim(),
                description: description.trim(),
                date: date || new Date().toISOString(),
            };

            try {
                // const response = await apiService.createBroadcast(broadcastData);
                // broadcastData.id = response.id;

                // Добавляем карточку
                cardManager.addBroadcastCard(broadcastData);

                // Закрываем модальное окно
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    restoreBodyScroll();
                }

                // Очищаем форму и ошибки
                clearAllErrors(this);
                this.reset();
            } catch (error) {
                console.error('Ошибка при создании трансляции:', error);
                alert('Ошибка при создании трансляции. Попробуйте еще раз.');
            }
        });
    }

    // Загружаем карточки при загрузке страницы
    if (typeof cardManager !== 'undefined') {
        cardManager.init();
        cardManager.initExistingCards();
        cardManager.loadAllCards();
    }

    // Делегирование кликов по кнопкам редактирования квизов в блоке квизов
    const quizzesContainer = document.querySelector('[data-tab-content="quizzes"]');
    if (quizzesContainer) {
        quizzesContainer.addEventListener('click', async function(e) {
            const editButton = e.target.closest('[data-action="edit"]');
            if (!editButton) return;

            const card = editButton.closest('.broadcast-card');
            if (!card) return;

            const quizId = card.dataset.id;
            if (!quizId) return;

            try {
                if (typeof apiService !== 'undefined') {
                    const quiz = await apiService.getQuiz(quizId);
                    localStorage.setItem('editingQuizTitle', quiz.title);
                    localStorage.setItem('editingQuizDescription', quiz.description || '');
                    localStorage.setItem('editingQuizId', quiz.id);
                } else {
                    localStorage.setItem('editingQuizTitle', 'Квиз');
                    localStorage.setItem('editingQuizDescription', '');
                    localStorage.setItem('editingQuizId', quizId);
                }

                window.location.href = 'quiz-editor.html?id=' + quizId;
            } catch (error) {
                console.error('Ошибка при загрузке квиза для редактирования:', error);
                alert('Не удалось загрузить квиз. Попробуйте позже.');
            }
        });
    }
});


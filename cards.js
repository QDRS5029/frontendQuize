// Модуль для работы с карточками
class CardManager {
    constructor() {
        this.broadcastsContainer = document.querySelector('[data-tab-content="broadcasts"]');
        this.quizzesContainer = document.querySelector('[data-tab-content="quizzes"]');
        this.statisticsContainer = document.querySelector('[data-tab-content="statistics"]');
    }

    // Создать карточку трансляции
    createBroadcastCard(broadcastData) {
        const card = document.createElement('article');
        card.className = 'broadcast-card';
        card.dataset.id = broadcastData.id || Date.now();

        const date = broadcastData.date ? this.formatDate(broadcastData.date) : 'Не указана';
        const description = broadcastData.description || 'Описание отсутствует';

        card.innerHTML = `
            <div class="broadcast-card__bg"></div>
            <button class="broadcast-card__close" aria-label="Закрыть карточку" data-card-id="${card.dataset.id}">
                <img src="img/close-icon.svg" alt="" class="broadcast-card__close-icon">
            </button>
            
            <div class="broadcast-card__play-wrapper">
                <div class="broadcast-card__play-icon">
                    <img src="img/play-icon.svg" alt="" class="broadcast-card__play-triangle">
                </div>
            </div>

            <h3 class="broadcast-card__title">${broadcastData.title || 'Трансляция'}</h3>
            <p class="broadcast-card__date">${date}</p>
            <p class="broadcast-card__description">${description}</p>

            <div class="broadcast-card__pattern">
                <img src="img/card-pattern.svg" alt="" class="broadcast-card__pattern-image">
            </div>

            <div class="broadcast-card__actions">
                <button class="button button--primary" data-action="start" data-card-id="${card.dataset.id}">Начать трансляцию</button>
                <button class="button button--secondary" data-modal="add-quiz" data-card-id="${card.dataset.id}">Добавить квиз</button>
            </div>
        `;

        // Добавляем обработчик закрытия
        const closeBtn = card.querySelector('.broadcast-card__close');
        closeBtn.addEventListener('click', () => this.deleteBroadcastCard(card.dataset.id));

        return card;
    }

    // Создать карточку квиза
    createQuizCard(quizData) {
        const card = document.createElement('article');
        card.className = 'broadcast-card quiz-card';
        card.dataset.id = quizData.id || Date.now();

        const questionCount = quizData.questionCount || 0;
        const description = quizData.description || 'Описание отсутствует';

        card.innerHTML = `
            <div class="broadcast-card__bg"></div>
            <button class="broadcast-card__close" aria-label="Закрыть карточку" data-card-id="${card.dataset.id}">
                <img src="img/close-icon.svg" alt="" class="broadcast-card__close-icon">
            </button>
            
            <div class="broadcast-card__play-wrapper">
                <img src="img/Warning.svg" alt="" class="quiz-card__icon">
            </div>

            <h3 class="broadcast-card__title">${quizData.title || 'Квиз'}</h3>
            <p class="broadcast-card__date">${questionCount} вопросов</p>
            <p class="broadcast-card__description">${description}</p>

            <div class="broadcast-card__pattern">
                <img src="img/card-pattern.svg" alt="" class="broadcast-card__pattern-image">
            </div>

            <div class="broadcast-card__actions">
                <button class="button button--primary" data-action="view" data-card-id="${card.dataset.id}">Просмотр</button>
                <button class="button button--secondary" data-action="edit" data-card-id="${card.dataset.id}">Изменить</button>
            </div>
        `;

        // Добавляем обработчик закрытия
        const closeBtn = card.querySelector('.broadcast-card__close');
        closeBtn.addEventListener('click', () => this.deleteQuizCard(card.dataset.id));

        return card;
    }

    // Добавить карточку трансляции в контейнер
    addBroadcastCard(broadcastData) {
        if (!this.broadcastsContainer) return;

        const card = this.createBroadcastCard(broadcastData);
        this.broadcastsContainer.appendChild(card);
        this.updateCardWidths(this.broadcastsContainer);
        return card;
    }

    // Добавить карточку квиза в контейнер
    addQuizCard(quizData) {
        if (!this.quizzesContainer) return;

        const card = this.createQuizCard(quizData);
        this.quizzesContainer.appendChild(card);
        this.updateCardWidths(this.quizzesContainer);
        return card;
    }

    // Обновить ширину карточек в зависимости от их количества
    updateCardWidths(container) {
        if (!container) return;

        const cards = container.querySelectorAll('.broadcast-card');
        const cardCount = cards.length;

        if (cardCount === 1) {
            // Если карточка одна, делаем её ширину как для 2 карточек
            cards.forEach(card => {
                card.style.maxWidth = 'calc((100% - 40px) / 2)';
                card.style.minWidth = 'calc((100% - 40px) / 2)';
            });
        } else if (cardCount === 2) {
            // Если карточек 2, они равномерно распределяются
            cards.forEach(card => {
                card.style.maxWidth = 'calc((100% - 40px) / 2)';
                card.style.minWidth = 'calc((100% - 40px) / 2)';
            });
        } else if (cardCount >= 3) {
            // Если 3 или больше, возвращаем стандартную ширину (по 3 в строку)
            cards.forEach(card => {
                card.style.maxWidth = '';
                card.style.minWidth = '';
            });
        }
    }

    // Удалить карточку трансляции
    async deleteBroadcastCard(id) {
        const card = document.querySelector(`[data-tab-content="broadcasts"] .broadcast-card[data-id="${id}"]`);
        if (card) {
            try {
                // await apiService.deleteBroadcast(id);
                card.remove();
                this.updateCardWidths(this.broadcastsContainer);
            } catch (error) {
                console.error('Ошибка при удалении трансляции:', error);
                // Удаляем карточку даже при ошибке API
                card.remove();
                this.updateCardWidths(this.broadcastsContainer);
            }
        }
    }

    // Удалить карточку квиза
    async deleteQuizCard(id) {
        const card = document.querySelector(`[data-tab-content="quizzes"] .broadcast-card[data-id="${id}"]`);
        if (card) {
            try {
                // await apiService.deleteQuiz(id);
                card.remove();
                this.updateCardWidths(this.quizzesContainer);
            } catch (error) {
                console.error('Ошибка при удалении квиза:', error);
                // Удаляем карточку даже при ошибке API
                card.remove();
                this.updateCardWidths(this.quizzesContainer);
            }
        }
    }

    // Загрузить все карточки
    async loadAllCards() {
        try {
            // Трансляции пока не подключены к бекенду

            // Загружаем квизы из бекенда
            if (typeof apiService !== 'undefined') {
                // Очищаем контейнер квизов от статического HTML
                if (this.quizzesContainer) {
                    this.quizzesContainer.innerHTML = '';
                }

                const quizzes = await apiService.getQuizzes();

                // Для каждой викторины подтягиваем количество вопросов
                const quizzesWithCounts = await Promise.all(
                    quizzes.map(async (quiz) => {
                        let questionCount = 0;
                        try {
                            const questions = await apiService.getQuestions(quiz.id);
                            questionCount = Array.isArray(questions) ? questions.length : 0;
                        } catch (e) {
                            console.error('Не удалось загрузить вопросы для квиза', quiz.id, e);
                        }
                        return {
                            ...quiz,
                            questionCount,
                        };
                    })
                );

                quizzesWithCounts.forEach(quiz => {
                    this.addQuizCard({
                        id: quiz.id,
                        title: quiz.title,
                        description: quiz.description,
                        questionCount: quiz.questionCount,
                    });
                });

                // Обновляем выпадающий список "Добавить квиз"
                if (typeof updateQuizDropdown === 'function') {
                    updateQuizDropdown(quizzesWithCounts);
                }
            }

            // Обновляем ширину карточек после загрузки
            this.updateCardWidths(this.broadcastsContainer);
            this.updateCardWidths(this.quizzesContainer);
        } catch (error) {
            console.error('Ошибка при загрузке карточек:', error);
        }
    }

    // Инициализация - обновить ширину существующих карточек
    init() {
        this.updateCardWidths(this.broadcastsContainer);
        this.updateCardWidths(this.quizzesContainer);
        this.updateCardWidths(this.statisticsContainer);
    }

    // Инициализация обработчиков для существующих карточек
    initExistingCards() {
        // Обработчики для карточек трансляций
        if (this.broadcastsContainer) {
            const broadcastCards = this.broadcastsContainer.querySelectorAll('.broadcast-card');
            broadcastCards.forEach((card, index) => {
                const closeBtn = card.querySelector('.broadcast-card__close');
                if (closeBtn && !closeBtn.dataset.initialized) {
                    // Генерируем уникальный ID если его нет
                    if (!card.dataset.id) {
                        card.dataset.id = `broadcast-${Date.now()}-${index}`;
                    }
                    const cardId = card.dataset.id;
                    closeBtn.dataset.cardId = cardId;
                    closeBtn.dataset.initialized = 'true';
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deleteBroadcastCard(cardId);
                    });
                }
            });
        }

        // Обработчики для карточек квизов
        if (this.quizzesContainer) {
            const quizCards = this.quizzesContainer.querySelectorAll('.broadcast-card');
            quizCards.forEach((card, index) => {
                const closeBtn = card.querySelector('.broadcast-card__close');
                if (closeBtn && !closeBtn.dataset.initialized) {
                    // Генерируем уникальный ID если его нет
                    if (!card.dataset.id) {
                        card.dataset.id = `quiz-${Date.now()}-${index}`;
                    }
                    const cardId = card.dataset.id;
                    closeBtn.dataset.cardId = cardId;
                    closeBtn.dataset.initialized = 'true';
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deleteQuizCard(cardId);
                    });
                }
            });
        }

        // Обработчики для карточек статистики
        if (this.statisticsContainer) {
            const statisticsCards = this.statisticsContainer.querySelectorAll('.broadcast-card');
            statisticsCards.forEach((card, index) => {
                const closeBtn = card.querySelector('.broadcast-card__close');
                if (closeBtn && !closeBtn.dataset.initialized) {
                    // Генерируем уникальный ID если его нет
                    if (!card.dataset.id) {
                        card.dataset.id = `statistics-${Date.now()}-${index}`;
                    }
                    const cardId = card.dataset.id;
                    closeBtn.dataset.cardId = cardId;
                    closeBtn.dataset.initialized = 'true';
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Для статистики просто удаляем карточку из DOM
                        card.remove();
                        this.updateCardWidths(this.statisticsContainer);
                    });
                }
            });
        }
    }

    // Форматирование даты
    formatDate(dateString) {
        if (!dateString) return 'Не указана';

        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}.${month}.${year}  ${hours}:${minutes}`;
    }
}

// Экспортируем экземпляр менеджера карточек
const cardManager = new CardManager();


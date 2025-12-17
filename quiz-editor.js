// Редактор вопросов квиза
class QuizEditor {
    constructor() {
        this.quizId = this.getQuizIdFromUrl();
        this.questions = [];
        this.initialQuestionIds = [];
        this.init();
    }

    getQuizIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || null;
    }

    init() {
        this.loadQuizData();
        this.setupEventListeners();
    }

    async loadQuizData() {
        try {
            let quizTitle = localStorage.getItem('editingQuizTitle') || 'Название квиза';

            // Если есть id квиза и apiService, пробуем загрузить данные из бекенда
            if (this.quizId && typeof apiService !== 'undefined') {
                try {
                    const quiz = await apiService.getQuiz(this.quizId);
                    quizTitle = quiz.title || quizTitle;

                    // Загружаем вопросы квиза
                    const questionsFromApi = await apiService.getQuestions(this.quizId);

                    this.initialQuestionIds = questionsFromApi.map(q => q.id);

                    this.questions = questionsFromApi.map((q, idx) => {
                        const answers = Array.isArray(q.answers) ? q.answers : [];

                        // Разделяем ответы на корректные/некорректные
                        const mappedAnswers = answers.map(ans => ({
                            text: ans.text || '',
                            isCorrect: !!ans.is_correct,
                        }));

                        // Тип вопроса: предполагаем, что бекенд отдаёт "open" / "test"
                        const type = q.type === 'open' ? 'open' : 'test';

                        // Для открытого вопроса берём первый корректный ответ как основной
                        let openAnswer = '';
                        if (type === 'open') {
                            const correct = mappedAnswers.find(a => a.isCorrect);
                            openAnswer = correct ? correct.text : (mappedAnswers[0]?.text || '');
                        }

                        return {
                            id: q.id,
                            type,
                            text: q.text || '',
                            answer: openAnswer,
                            answers: type === 'test' ? mappedAnswers : [],
                            points: 1,
                            time: q.time_limit || 1,
                            media: {
                                video: null,
                                audio: null,
                                image: null,
                            },
                            orderIndex: q.order_index ?? idx,
                        };
                    });
                } catch (e) {
                    console.error('Не удалось загрузить квиз/вопросы из бекенда, используем локальные данные:', e);
                }
            }

            const titleHeader = document.getElementById('quiz-title-header');
            if (titleHeader) {
                titleHeader.textContent = quizTitle;
            }

            this.renderQuestions();
        } catch (error) {
            console.error('Ошибка при загрузке квиза:', error);
        }
    }

    buildQuestionPayload(question, index) {
        const base = {
            text: question.text || '',
            type: question.type === 'open' ? 'open' : 'test',
            time_limit: question.time || 1,
            order_index: index,
            media_id: null,
        };

        let answers = [];

        if (base.type === 'open') {
            if (question.answer && question.answer.trim() !== '') {
                answers = [
                    {
                        // question_id заполняет бекенд, здесь ставим заглушку
                        question_id: 0,
                        text: question.answer,
                        is_correct: true,
                    },
                ];
            }
        } else {
            answers = (question.answers || []).map(a => ({
                question_id: 0,
                text: a.text || '',
                is_correct: !!a.isCorrect,
            })).filter(a => a.text.trim() !== '');
        }

        return {
            ...base,
            answers,
        };
    }

    setupEventListeners() {
        // Кнопка "Назад"
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // Кнопка "Сохранить квиз"
        const saveButton = document.getElementById('save-quiz-button');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveQuiz());
        }

        // Кнопка "Добавить вопрос" с выпадающим списком
        const addQuestionButton = document.getElementById('add-question-button');
        const dropdown = document.getElementById('question-type-dropdown');

        if (addQuestionButton && dropdown) {
            addQuestionButton.addEventListener('click', (e) => {
                e.stopPropagation();
                addQuestionButton.classList.toggle('active');
                dropdown.classList.toggle('active');
            });

            // Закрытие при клике вне
            document.addEventListener('click', (e) => {
                if (!addQuestionButton.contains(e.target) && !dropdown.contains(e.target)) {
                    addQuestionButton.classList.remove('active');
                    dropdown.classList.remove('active');
                }
            });

            // Выбор типа вопроса
            const dropdownItems = dropdown.querySelectorAll('[data-question-type]');
            dropdownItems.forEach(item => {
                item.addEventListener('click', () => {
                    const questionType = item.dataset.questionType;
                    this.addQuestion(questionType);
                    addQuestionButton.classList.remove('active');
                    dropdown.classList.remove('active');
                });
            });
        }
    }

    addQuestion(type) {
        const question = {
            type: type, // 'open' или 'test'
            text: '',
            answer: '',
            answers: type === 'test' ? [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] : [],
            points: 1,
            time: 1,
            media: {
                video: null,
                audio: null,
                image: null
            }
        };

        this.questions.push(question);
        this.renderQuestions();
    }

    renderQuestions() {
        const questionsList = document.getElementById('questions-list');
        if (!questionsList) return;

        questionsList.innerHTML = '';

        if (this.questions.length === 0) {
            questionsList.innerHTML = '<p class="quiz-editor__empty">Вопросы отсутствуют. Добавьте первый вопрос.</p>';
            return;
        }

        this.questions.forEach((question, index) => {
            const questionElement = this.createQuestionElement(question, index);
            questionsList.appendChild(questionElement);
        });
    }

    createQuestionElement(question, index) {
        const questionDiv = document.createElement('div');
        questionDiv.className = `question-item question-item--${question.type}`;
        questionDiv.dataset.index = index;

        if (question.type === 'open') {
            questionDiv.innerHTML = this.createOpenQuestionHTML(question, index);
        } else {
            questionDiv.innerHTML = this.createTestQuestionHTML(question, index);
        }

        // Обработчики событий
        this.setupQuestionEventListeners(questionDiv, question, index);

        return questionDiv;
    }

    createOpenQuestionHTML(question, index) {
        return `
            <button class="question-item__close" aria-label="Закрыть">
                <img src="img/close-icon.svg" alt="" class="question-item__close-icon">
            </button>
            <input type="text" class="question-item__question-field" placeholder="Вопрос" value="${this.escapeHtml(question.text)}" data-field="text">
            <div class="question-item__answer-row">
                <input type="text" class="question-item__answer-field" placeholder="Ответ" value="${this.escapeHtml(question.answer)}" data-field="answer">
                <div class="question-item__media-buttons">
                    <button class="question-item__media-button" data-media="video">Добавить видео</button>
                    <button class="question-item__media-button" data-media="audio">Добавить аудио</button>
                    <button class="question-item__media-button" data-media="image">Добавить изображение</button>
                </div>
                <div class="question-item__controls">
                    <div class="question-item__control-button" data-control="points" data-selected="${question.points || 0}">
                        <span>${question.points ? String(question.points).padStart(2, '0') : 'Баллы'}</span>
                        <img src="img/arrow-down.svg" alt="" class="question-item__control-arrow">
                        <div class="question-item__control-dropdown" data-dropdown="points">
                            ${this.generateDropdownOptions(1, 99, question.points || 1)}
                        </div>
                    </div>
                    <div class="question-item__control-button" data-control="time" data-selected="${question.time || 0}">
                        <span>${question.time ? String(question.time).padStart(2, '0') : 'Время'}</span>
                        <img src="img/arrow-down.svg" alt="" class="question-item__control-arrow">
                        <div class="question-item__control-dropdown" data-dropdown="time">
                            ${this.generateDropdownOptions(1, 99, question.time || 1)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createTestQuestionHTML(question, index) {
        const firstAnswer = question.answers[0] || { text: '' };
        const otherAnswers = question.answers.slice(1);

        // Правильный ответ
        const firstAnswerHTML = `
            <div class="answer-item-test" data-answer-index="0">
                <img src="img/Done_round_light.svg" alt="" class="answer-item-test__icon" data-action="correct">
                <input type="text" class="answer-item-test__input" placeholder="Вариант ответа" value="${this.escapeHtml(firstAnswer.text)}" data-field="answer">
            </div>
        `;

        // Остальные ответы
        const otherAnswersHTML = otherAnswers.map((answer, answerIndex) => {
            return `
                <div class="answer-item-test" data-answer-index="${answerIndex + 1}" style="margin-top: ${answerIndex === 0 ? '18px' : '20px'};">
                    <img src="img/Close_round.svg" alt="" class="answer-item-test__icon" data-action="incorrect">
                    <input type="text" class="answer-item-test__input" placeholder="Вариант ответа" value="${this.escapeHtml(answer.text)}" data-field="answer">
                    <img src="img/Trash_Full.svg" alt="Удалить" class="answer-item-test__delete" data-action="delete">
                </div>
            `;
        }).join('');

        // Плюсик под последним ответом
        const addButtonHTML = `
            <button class="answer-item-test__add" data-action="add-answer">
                <img src="img/plus-icon.svg" alt="Добавить ответ" class="answer-item-test__add-icon">
            </button>
        `;

        return `
            <button class="question-item__close" aria-label="Закрыть">
                <img src="img/close-icon.svg" alt="" class="question-item__close-icon">
            </button>
            <input type="text" class="question-item__question-field" placeholder="Вопрос" value="${this.escapeHtml(question.text)}" data-field="text">
            <div class="question-item__answer-row">
                <div class="question-item__answers-container">
                    ${firstAnswerHTML}
                    ${otherAnswersHTML}
                    ${addButtonHTML}
                </div>
                <div class="question-item__media-buttons question-item__media-buttons--test">
                    <button class="question-item__media-button" data-media="video">Добавить видео</button>
                    <button class="question-item__media-button" data-media="audio">Добавить аудио</button>
                    <button class="question-item__media-button" data-media="image">Добавить изображение</button>
                </div>
                <div class="question-item__controls">
                    <div class="question-item__control-button" data-control="points" data-selected="${question.points || 0}">
                        <span>${question.points ? String(question.points).padStart(2, '0') : 'Баллы'}</span>
                        <img src="img/arrow-down.svg" alt="" class="question-item__control-arrow">
                        <div class="question-item__control-dropdown" data-dropdown="points">
                            ${this.generateDropdownOptions(1, 99, question.points || 1)}
                        </div>
                    </div>
                    <div class="question-item__control-button" data-control="time" data-selected="${question.time || 0}">
                        <span>${question.time ? String(question.time).padStart(2, '0') : 'Время'}</span>
                        <img src="img/arrow-down.svg" alt="" class="question-item__control-arrow">
                        <div class="question-item__control-dropdown" data-dropdown="time">
                            ${this.generateDropdownOptions(1, 99, question.time || 1)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateDropdownOptions(min, max, current) {
        let options = '';
        for (let i = min; i <= max; i++) {
            const padded = String(i).padStart(2, '0');
            const selected = i === current ? 'class="question-item__control-dropdown-item selected"' : 'class="question-item__control-dropdown-item"';
            options += `<div ${selected} data-value="${i}">${padded}</div>`;
        }
        return options;
    }

    setupQuestionEventListeners(questionDiv, question, index) {
        // Закрытие карточки
        const closeBtn = questionDiv.querySelector('.question-item__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.deleteQuestion(index));
        }

        // Сохранение изменений в полях
        const textField = questionDiv.querySelector('[data-field="text"]');
        if (textField) {
            textField.addEventListener('input', (e) => {
                this.questions[index].text = e.target.value;
            });
        }

        if (question.type === 'open') {
            const answerField = questionDiv.querySelector('[data-field="answer"]');
            if (answerField) {
                answerField.addEventListener('input', (e) => {
                    this.questions[index].answer = e.target.value;
                });
            }

            // Кнопки медиа
            const mediaButtons = questionDiv.querySelectorAll('[data-media]');
            mediaButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const mediaType = btn.dataset.media;
                    console.log(`Добавить ${mediaType}`);
                });
            });
        } else {
            // Обработка всех ответов тестового вопроса
            const answersContainer = questionDiv.querySelector('.question-item__answers-container');
            if (answersContainer) {
                answersContainer.addEventListener('input', (e) => {
                    if (e.target.classList.contains('answer-item-test__input')) {
                        const answerIndex = parseInt(e.target.closest('.answer-item-test').dataset.answerIndex);
                        this.questions[index].answers[answerIndex].text = e.target.value;
                    }
                });

                answersContainer.addEventListener('click', (e) => {
                    const answerItem = e.target.closest('.answer-item-test');
                    if (!answerItem) return;

                    if (e.target.classList.contains('answer-item-test__delete')) {
                        const answerIndex = parseInt(answerItem.dataset.answerIndex);
                        if (this.questions[index].answers.length > 1) {
                            this.questions[index].answers.splice(answerIndex, 1);
                            this.renderQuestions();
                        }
                    }
                });
            }

            // Кнопка добавления ответа
            const addAnswerBtn = questionDiv.querySelector('.question-item__answers-container .answer-item-test__add');
            if (addAnswerBtn) {
                addAnswerBtn.addEventListener('click', () => {
                    this.questions[index].answers.push({ text: '', isCorrect: false });
                    this.renderQuestions();
                });
            }

            // Кнопки медиа
            const mediaButtons = questionDiv.querySelectorAll('[data-media]');
            mediaButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const mediaType = btn.dataset.media;
                    console.log(`Добавить ${mediaType}`);
                });
            });
        }

        // Выпадающие списки для Баллы и Время
        const controlButtons = questionDiv.querySelectorAll('[data-control]');
        controlButtons.forEach(btn => {
            const dropdown = btn.querySelector('.question-item__control-dropdown');
            const span = btn.querySelector('span');

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.classList.toggle('active');
                dropdown.classList.toggle('active');
            });

            dropdown.addEventListener('click', (e) => {
                if (e.target.classList.contains('question-item__control-dropdown-item')) {
                    const value = parseInt(e.target.dataset.value);
                    const controlType = btn.dataset.control;
                    this.questions[index][controlType] = value;
                    span.textContent = String(value).padStart(2, '0');
                    btn.dataset.selected = value;
                    btn.classList.remove('active');
                    dropdown.classList.remove('active');
                    this.renderQuestions();
                }
            });
        });

        // Закрытие выпадающих списков при клике вне
        document.addEventListener('click', () => {
            controlButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.querySelector('.question-item__control-dropdown').classList.remove('active');
            });
        });
    }

    deleteQuestion(index) {
        this.questions.splice(index, 1);
        this.renderQuestions();
    }

    async saveQuiz() {
        try {
            if (!this.quizId || typeof apiService === 'undefined') {
                alert('Нет идентификатора квиза или API недоступен, вопросы не могут быть сохранены.');
                return;
            }

            const quizIdNum = Number(this.quizId);
            const savedIds = [];

            // Создаём/обновляем вопросы
            for (let i = 0; i < this.questions.length; i++) {
                const q = this.questions[i];
                const payload = this.buildQuestionPayload(q, i);

                // Пропускаем полностью пустые вопросы
                if (!payload.text.trim()) {
                    continue;
                }

                let result;
                if (q.id) {
                    result = await apiService.updateQuestion(q.id, payload);
                } else {
                    result = await apiService.createQuestion(quizIdNum, payload);
                }

                this.questions[i].id = result.id;
                savedIds.push(result.id);
            }

            // Удаляем вопросы, которые были раньше, но исчезли из текущего списка
            const toDelete = (this.initialQuestionIds || []).filter(id => !savedIds.includes(id));
            for (const id of toDelete) {
                await apiService.deleteQuestion(id);
            }

            this.initialQuestionIds = savedIds;

            // Переход на страницу со списком квизов, сразу на вкладку "Квизы"
            window.location.href = 'index.html#quizzes';
        } catch (error) {
            console.error('Ошибка при сохранении квиза:', error);
            alert('Ошибка при сохранении квиза. Попробуйте еще раз.');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Инициализация редактора при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.quizEditor = new QuizEditor();
});

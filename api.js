// API модуль для работы с бекендом
// По умолчанию FastAPI поднимается на 8000 порту без префикса /api
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    // Общий метод для выполнения запросов
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // ===== КВИЗЫ =====

    // Получить все квизы
    async getQuizzes() {
        // GET /quizzes/
        return this.request('/quizzes/');
    }

    // Получить один квиз по id
    async getQuiz(id) {
        // GET /quizzes/{quiz_id}
        return this.request(`/quizzes/${id}`);
    }

    // Создать квиз (QuizCreate)
    // author_id пока захардкожен как 1, чтобы можно было тестировать без авторизации
    async createQuiz({ title, description }) {
        const payload = {
            title,
            description: description || null,
            author_id: 1,
            is_public: false,
        };
        return this.request('/quizzes/', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    // Обновить квиз (QuizUpdate)
    async updateQuiz(id, quizData) {
        return this.request(`/quizzes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(quizData),
        });
    }

    // Удалить квиз
    async deleteQuiz(id) {
        return this.request(`/quizzes/${id}`, {
            method: 'DELETE',
        });
    }

    // ===== ВОПРОСЫ =====

    // Получить вопросы квиза: GET /questions/?quiz_id={id}
    async getQuestions(quizId) {
        return this.request(`/questions/?quiz_id=${quizId}`);
    }

    // Создать вопрос для квиза: POST /questions/quiz/{quiz_id}
    async createQuestion(quizId, questionData) {
        return this.request(`/questions/quiz/${quizId}`, {
            method: 'POST',
            body: JSON.stringify(questionData),
        });
    }

    // Обновить вопрос: PUT /questions/{question_id}
    async updateQuestion(questionId, questionData) {
        return this.request(`/questions/${questionId}`, {
            method: 'PUT',
            body: JSON.stringify(questionData),
        });
    }

    // Удалить вопрос: DELETE /questions/{question_id}
    async deleteQuestion(questionId) {
        return this.request(`/questions/${questionId}`, {
            method: 'DELETE',
        });
    }
}

// Экспортируем экземпляр API сервиса
const apiService = new ApiService();




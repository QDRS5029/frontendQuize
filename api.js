// API модуль для работы с бекендом
const API_BASE_URL = 'http://localhost:3000/api';

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

    // Получить все трансляции
    async getBroadcasts() {
        return this.request('/broadcasts');
    }

    // Создать трансляцию
    async createBroadcast(broadcastData) {
        return this.request('/broadcasts', {
            method: 'POST',
            body: JSON.stringify(broadcastData),
        });
    }

    // Обновить трансляцию
    async updateBroadcast(id, broadcastData) {
        return this.request(`/broadcasts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(broadcastData),
        });
    }

    // Удалить трансляцию
    async deleteBroadcast(id) {
        return this.request(`/broadcasts/${id}`, {
            method: 'DELETE',
        });
    }

    // Получить все квизы
    async getQuizzes() {
        return this.request('/quizzes');
    }

    // Создать квиз
    async createQuiz(quizData) {
        return this.request('/quizzes', {
            method: 'POST',
            body: JSON.stringify(quizData),
        });
    }

    // Обновить квиз
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

    // Получить статистику
    async getStatistics() {
        return this.request('/statistics');
    }
}

// Экспортируем экземпляр API сервиса
const apiService = new ApiService();



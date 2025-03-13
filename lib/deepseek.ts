// Константы и функции для работы с Deepseek API

// Базовый URL для Deepseek API
export const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Доступные модели Deepseek
export const DEEPSEEK_MODELS = {
	CHAT: "deepseek-chat",
	CODER: "deepseek-coder",
};

// Типы для сообщений чата
export type MessageRole = "system" | "user" | "assistant";

export interface ChatMessage {
	role: MessageRole;
	content: string;
}

// Системное сообщение для установки поведения модели
export const SYSTEM_MESSAGE: ChatMessage = {
	role: "system",
	content:
		"Вы - полезный ассистент, который отвечает на вопросы пользователя четко и информативно.",
};

// Настройки запроса для Deepseek API
export interface ChatRequestOptions {
	model?: string;
	temperature?: number;
	max_tokens?: number;
	top_p?: number;
	frequency_penalty?: number;
	presence_penalty?: number;
}

// Параметры запроса по умолчанию
export const DEFAULT_REQUEST_OPTIONS: ChatRequestOptions = {
	model: DEEPSEEK_MODELS.CHAT,
	temperature: 0.7,
	max_tokens: 2000,
	top_p: 0.95,
	frequency_penalty: 0,
	presence_penalty: 0,
};

// Максимальное количество сообщений в истории (для ограничения токенов)
export const MAX_CHAT_HISTORY = 20;

/**
 * Отправляет запрос к Deepseek API и возвращает ответ
 */
export async function sendChatRequest(
	messages: ChatMessage[],
	options: ChatRequestOptions = {}
): Promise<string> {
	// Проверяем наличие API-ключа
	const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
	if (!apiKey) {
		throw new Error(
			"API ключ не настроен. Добавьте NEXT_PUBLIC_DEEPSEEK_API_KEY в .env.local"
		);
	}

	// Ограничиваем количество сообщений в истории
	const recentMessages = messages.slice(-MAX_CHAT_HISTORY);

	// Добавляем системное сообщение в начало, если его ещё нет
	const hasSystemMessage = recentMessages.some(msg => msg.role === "system");
	const fullMessages = hasSystemMessage
		? recentMessages
		: [SYSTEM_MESSAGE, ...recentMessages];

	try {
		// Формируем параметры запроса
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: options.model || DEFAULT_REQUEST_OPTIONS.model,
				messages: fullMessages,
				temperature: options.temperature || DEFAULT_REQUEST_OPTIONS.temperature,
				max_tokens: options.max_tokens || DEFAULT_REQUEST_OPTIONS.max_tokens,
				top_p: options.top_p || DEFAULT_REQUEST_OPTIONS.top_p,
				frequency_penalty:
					options.frequency_penalty ||
					DEFAULT_REQUEST_OPTIONS.frequency_penalty,
				presence_penalty:
					options.presence_penalty || DEFAULT_REQUEST_OPTIONS.presence_penalty,
			}),
		};

		// Отправляем запрос
		const response = await fetch(DEEPSEEK_API_URL, requestOptions);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`Ошибка API (${response.status}): ${
					errorData.error?.message || response.statusText
				}`
			);
		}

		const data = await response.json();
		return data.choices[0].message.content;
	} catch (error) {
		console.error("Ошибка при отправке запроса к Deepseek API:", error);
		throw error;
	}
}

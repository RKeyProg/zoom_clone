"use client";

import { ChatMessage, DEEPSEEK_MODELS, sendChatRequest } from "@/lib/deepseek";
import { cn } from "@/lib/utils";
import {
	Bot,
	Check,
	CircleX,
	Copy,
	RefreshCw,
	SendHorizontal,
	Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Интерфейс сообщения с метаданными для UI
interface UIMessage extends ChatMessage {
	id: string;
	timestamp: Date;
	pending?: boolean;
	error?: boolean;
}

const ChatBot = () => {
	// Состояние компонента
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<UIMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

	// Ссылки на DOM-элементы
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Генерация уникального ID
	const generateId = () => Math.random().toString(36).substring(2, 15);

	// Фокус на поле ввода при открытии чата
	useEffect(() => {
		if (isOpen && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [isOpen]);

	// Автоматическая прокрутка к последнему сообщению
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	// Функция отправки сообщения
	const handleSendMessage = async () => {
		if (!input.trim() || isLoading) return;

		// Добавляем сообщение пользователя
		const userMessageId = generateId();
		const userMessage: UIMessage = {
			id: userMessageId,
			role: "user",
			content: input,
			timestamp: new Date(),
		};

		setMessages(prev => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);
		setError(null);

		// Добавляем "болванку" для сообщения ассистента
		const assistantMessageId = generateId();
		const pendingMessage: UIMessage = {
			id: assistantMessageId,
			role: "assistant",
			content: "",
			timestamp: new Date(),
			pending: true,
		};

		setMessages(prev => [...prev, pendingMessage]);

		try {
			// Формируем сообщения для API (без UI-метаданных)
			const apiMessages: ChatMessage[] = messages
				.filter(msg => !msg.pending && !msg.error)
				.map(({ role, content }) => ({ role, content }));

			// Добавляем текущее сообщение пользователя
			apiMessages.push({
				role: "user",
				content: input,
			});

			// Получаем ответ от API
			const response = await sendChatRequest(apiMessages, {
				model: DEEPSEEK_MODELS.CHAT,
			});

			// Обновляем сообщение ассистента
			setMessages(prev =>
				prev.map(msg =>
					msg.id === assistantMessageId
						? { ...msg, content: response, pending: false }
						: msg
				)
			);
		} catch (err) {
			// Обрабатываем ошибку
			const errorMessage =
				err instanceof Error ? err.message : "Произошла неизвестная ошибка";
			setError(errorMessage);

			// Обновляем сообщение с ошибкой
			setMessages(prev =>
				prev.map(msg =>
					msg.id === assistantMessageId
						? {
								...msg,
								content:
									"Ошибка при получении ответа. Пожалуйста, попробуйте еще раз.",
								pending: false,
								error: true,
						  }
						: msg
				)
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Обработка нажатия Enter для отправки сообщения
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	// Очистка истории чата
	const clearChat = () => {
		setMessages([]);
		setError(null);
	};

	// Копирование текста сообщения
	const copyMessageText = (id: string, text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setCopiedMessageId(id);
			setTimeout(() => setCopiedMessageId(null), 2000);
		});
	};

	// Компонент для отображения сообщения
	const MessageBubble = ({ message }: { message: UIMessage }) => {
		const isUser = message.role === "user";

		return (
			<div
				className={cn(
					"group relative animate-fadeIn",
					isUser ? "self-end" : "self-start"
				)}
			>
				<div
					className={cn(
						"relative p-3.5 rounded-xl",
						isUser
							? "bg-blue-600 text-white rounded-br-sm"
							: "bg-gray-100 text-gray-800 rounded-bl-sm",
						message.error && "bg-red-50 border border-red-200"
					)}
				>
					{message.pending ? (
						<div className='flex items-center'>
							<RefreshCw size={16} className='animate-spin mr-2' />
							<span>AI печатает...</span>
						</div>
					) : (
						<>
							<p className='whitespace-pre-wrap'>{message.content}</p>
							<div
								className={cn(
									"opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2",
									isUser ? "text-white" : "text-gray-500"
								)}
							>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									className={cn(
										"h-6 w-6 rounded-full",
										isUser ? "hover:bg-blue-700" : "hover:bg-gray-200"
									)}
									onClick={() => copyMessageText(message.id, message.content)}
								>
									{copiedMessageId === message.id ? (
										<Check size={14} />
									) : (
										<Copy size={14} />
									)}
								</Button>
							</div>
						</>
					)}
					<div
						className={cn(
							"text-xs mt-1 opacity-70",
							isUser ? "text-blue-100" : "text-gray-500"
						)}
					>
						{message.timestamp.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</div>
				</div>
			</div>
		);
	};

	// Условный рендеринг: кнопка или чат
	const renderChat = () => (
		<div className='fixed bottom-5 left-5 z-50'>
			{isOpen ? (
				<div
					className={cn(
						"w-80 h-[500px] rounded-2xl bg-white shadow-lg flex flex-col overflow-hidden",
						"border border-gray-200 transition-all duration-300 animate-slideUp"
					)}
				>
					{/* Шапка чата */}
					<div className='py-3 px-4 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<Bot size={20} />
							<h3 className='font-medium'>AI Ассистент</h3>
						</div>
						<div className='flex items-center gap-1'>
							<Button
								type='button'
								variant='ghost'
								size='icon'
								className='h-7 w-7 rounded-full hover:bg-blue-700'
								onClick={clearChat}
							>
								<RefreshCw size={16} />
							</Button>
							<Button
								type='button'
								variant='ghost'
								size='icon'
								className='h-7 w-7 rounded-full hover:bg-blue-700'
								onClick={() => setIsOpen(false)}
							>
								<CircleX size={16} />
							</Button>
						</div>
					</div>

					{/* Сообщения */}
					<div
						ref={chatContainerRef}
						className='flex-1 overflow-y-auto p-4 bg-white text-black flex flex-col gap-3'
					>
						{error && (
							<div className='p-3 mb-1 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm'>
								<p className='font-medium'>Ошибка</p>
								<p className='text-xs mt-1'>{error}</p>
							</div>
						)}

						{messages.length === 0 ? (
							<div className='h-full flex flex-col items-center justify-center text-gray-400 gap-3'>
								<Sparkles className='h-8 w-8 text-blue-500' />
								<p className='text-center'>Задайте вопрос AI ассистенту</p>
							</div>
						) : (
							messages.map(message => (
								<MessageBubble key={message.id} message={message} />
							))
						)}
					</div>

					{/* Поле ввода */}
					<div className='p-3 border-t border-gray-100 bg-white'>
						<div className='flex items-center gap-2'>
							<Input
								ref={inputRef}
								value={input}
								onChange={e => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder='Введите сообщение...'
								className='flex-1 bg-gray-50'
								disabled={isLoading}
							/>
							<Button
								onClick={handleSendMessage}
								disabled={isLoading || !input.trim()}
								className='bg-blue-600 hover:bg-blue-700'
								size='icon'
							>
								<SendHorizontal className='h-4 w-4' />
							</Button>
						</div>
						<div className='mt-2 text-xs text-gray-400 text-center'>
							Powered by Deepseek AI
						</div>
					</div>
				</div>
			) : (
				<Button
					className='h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg p-0 flex items-center justify-center animate-pulse-slow'
					onClick={() => setIsOpen(true)}
				>
					<Bot className='h-7 w-7' />
				</Button>
			)}
		</div>
	);

	return renderChat();
};

export default ChatBot;

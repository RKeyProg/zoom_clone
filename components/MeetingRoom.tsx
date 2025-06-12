import { cn } from "@/lib/utils";
import {
	CallControls,
	CallParticipantsList,
	CallStatsButton,
	CallingState,
	PaginatedGridLayout,
	SpeakerLayout,
	useCall,
	useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, LayoutList, MicIcon, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

// Типы для транскрипции
type TranscriptItem = {
	id: string;
	participantId: string;
	participantName: string;
	text: string;
	timestamp: Date;
};

const MeetingRoom = () => {
	const searchParams = useSearchParams();
	const isPersonalRoom = !!searchParams.get("personal");
	const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
	const [showParticipants, setShowParticipants] = useState(false);
	const [showTranscription, setShowTranscription] = useState(false);
	const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);
	const router = useRouter();
	const call = useCall();

	const {
		useCallCallingState,
		useCallSettings,
		useIsCallTranscribingInProgress,
	} = useCallStateHooks();
	const callingState = useCallCallingState();
	const { transcription } = useCallSettings() || {};
	const isTranscribing = useIsCallTranscribingInProgress();

	// Подписка на события транскрипции
	useEffect(() => {
		if (!call) return;

		const handleTranscriptionReceived = (event: any) => {
			console.log("Получена транскрипция closed_caption:", event);

			// Получаем данные транскрипции из события call.closed_caption
			const { closed_caption } = event;
			if (closed_caption) {
				const { text, speaker_id, start_time, user } = closed_caption;

				// Получаем имя участника
				const participantName = user?.name || user?.id || "Неизвестный";

				if (text && text.trim()) {
					const newTranscript: TranscriptItem = {
						id: `${speaker_id}-${start_time}-${Date.now()}`,
						participantId: speaker_id,
						participantName,
						text: text.trim(),
						timestamp: new Date(),
					};

					console.log("Добавляем новый транскрипт:", newTranscript);
					setTranscriptItems(prev => [...prev, newTranscript]);
				}
			}
		};

		const handleTranscriptionStarted = (event: any) => {
			console.log("Транскрипция запущена:", event);
		};

		const handleTranscriptionStopped = (event: any) => {
			console.log("Транскрипция остановлена:", event);
		};

		const handleClosedCaptionsStarted = (event: any) => {
			console.log("Закрытые титры запущены:", event);
		};

		const handleClosedCaptionsStopped = (event: any) => {
			console.log("Закрытые титры остановлены:", event);
		};

		// Подписываемся на все события транскрипции для отладки
		call.on("call.closed_caption", handleTranscriptionReceived);
		call.on("call.transcription_started", handleTranscriptionStarted);
		call.on("call.transcription_stopped", handleTranscriptionStopped);
		call.on("call.closed_captions_started", handleClosedCaptionsStarted);
		call.on("call.closed_captions_stopped", handleClosedCaptionsStopped);

		// Очистка при размонтировании
		return () => {
			call.off("call.closed_caption", handleTranscriptionReceived);
			call.off("call.transcription_started", handleTranscriptionStarted);
			call.off("call.transcription_stopped", handleTranscriptionStopped);
			call.off("call.closed_captions_started", handleClosedCaptionsStarted);
			call.off("call.closed_captions_stopped", handleClosedCaptionsStopped);
		};
	}, [call]);

	// Обработчик переключения транскрипции согласно документации Stream
	const handleToggleTranscription = () => {
		if (!call) return;

		console.log("Текущее состояние транскрипции:", isTranscribing);
		console.log("Настройки транскрипции:", transcription);

		if (isTranscribing) {
			console.log("Останавливаем транскрипцию...");
			// Останавливаем транскрипцию
			call
				.stopTranscription()
				.then(() => {
					console.log("Транскрипция успешно остановлена");
				})
				.catch(err => {
					console.error("Не удалось остановить транскрипцию:", err);
				});
			// Останавливаем закрытые титры
			call
				.stopClosedCaptions?.()
				.then(() => {
					console.log("Закрытые титры успешно остановлены");
				})
				.catch(err => {
					console.error("Не удалось остановить закрытые титры:", err);
				});
		} else {
			console.log("Запускаем транскрипцию...");
			// Запускаем транскрипцию
			call
				.startTranscription()
				.then(() => {
					console.log("Транскрипция успешно запущена");
				})
				.catch(err => {
					console.error("Не удалось запустить транскрипцию:", err);
				});
			// Запускаем закрытые титры для получения событий в реальном времени
			call
				.startClosedCaptions?.()
				.then(() => {
					console.log("Закрытые титры успешно запущены");
				})
				.catch(err => {
					console.error("Не удалось запустить закрытые титры:", err);
				});
		}
	};

	// Форматирование времени
	const formatTime = (date: Date) => {
		return `${date.getHours().toString().padStart(2, "0")}:${date
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
	};

	if (callingState !== CallingState.JOINED) return <Loader />;

	const CallLayout = () => {
		switch (layout) {
			case "grid":
				return <PaginatedGridLayout />;
			case "speaker-left":
				return <SpeakerLayout participantsBarPosition='left' />;
			case "speaker-right":
				return <SpeakerLayout participantsBarPosition='right' />;
			default:
				return <SpeakerLayout participantsBarPosition='right' />;
		}
	};

	// Определяем, доступна ли функция транскрипции
	const isTranscriptionAvailable =
		transcription?.mode === "available" || transcription?.mode === "auto-on";

	return (
		<section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
			{/* Индикатор активной транскрипции */}
			{isTranscribing && (
				<div className='absolute top-4 right-4 z-50 bg-green-600 text-white px-3 py-2 rounded-md flex items-center shadow-lg'>
					<div className='mr-2 w-2 h-2 bg-white rounded-full animate-pulse'></div>
					<span className='text-sm'>Транскрипция активна</span>
				</div>
			)}

			<div className='relative flex justify-center size-full'>
				<div className='flex size-full max-w-[1000px] items-center'>
					<CallLayout />
				</div>
				<div
					className={cn("h-[calc(100vh-86px)] hidden ml-2", {
						"show-block": showParticipants,
					})}
				>
					<CallParticipantsList onClose={() => setShowParticipants(false)} />
				</div>
				{/* Панель транскрипции */}
				<div
					className={cn(
						"h-[calc(100vh-86px)] w-[300px] absolute top-0 right-0 border-1 border-blue-600 hidden ml-2 bg-[#19232D] rounded-lg p-4 overflow-y-auto box-border",
						{
							block: showTranscription,
						}
					)}
				>
					<div className='flex justify-between items-center mb-4'>
						<h3 className='text-lg font-medium'>
							Транскрипция ({transcriptItems.length})
						</h3>
						<button
							onClick={() => setShowTranscription(false)}
							className='text-gray-400 hover:text-white'
							aria-label='Закрыть транскрипцию'
						>
							×
						</button>
					</div>

					<div className='space-y-4'>
						{/* Кнопка для тестирования */}
						<button
							onClick={() => {
								const testTranscript: TranscriptItem = {
									id: `test-${Date.now()}`,
									participantId: "test-user",
									participantName: "Тест",
									text: "Это тестовое сообщение для проверки транскрипции",
									timestamp: new Date(),
								};
								setTranscriptItems(prev => [...prev, testTranscript]);
								console.log("Добавлена тестовая транскрипция");
							}}
							className='w-full bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700'
						>
							Добавить тестовую транскрипцию
						</button>

						{isTranscribing ? (
							<div>
								{transcriptItems.length > 0 ? (
									<div className='space-y-3'>
										{transcriptItems.map(item => (
											<div
												key={item.id}
												className='border-b border-gray-700 pb-2'
											>
												<div className='flex items-center gap-2 mb-1'>
													<MicIcon size={14} />
													<span className='font-medium text-sm'>
														{item.participantName}
													</span>
													<span className='text-xs text-gray-400 ml-auto'>
														{formatTime(item.timestamp)}
													</span>
												</div>
												<p className='text-sm pl-6 text-gray-200'>
													{item.text}
												</p>
											</div>
										))}
									</div>
								) : (
									<div className='text-center'>
										<div className='flex items-center justify-center mb-2'>
											<MicIcon size={16} className='mr-2' />
											<span className='text-sm'>Транскрипция работает</span>
										</div>
										<p className='text-xs text-gray-400'>
											Говорите в микрофон для получения транскрипции
										</p>
									</div>
								)}
							</div>
						) : (
							<p className='text-gray-400 text-center mt-8'>
								{isTranscriptionAvailable
									? "Нажмите кнопку микрофона для включения транскрипции"
									: "Транскрипция недоступна"}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className='fixed bottom-0 w-full flex-center gap-5 flex-wrap'>
				<CallControls onLeave={() => router.push("/")} />

				<DropdownMenu>
					<div className='flex items-center'>
						<DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4C535B] transition-all'>
							<LayoutList size={20} className='text-white' />
						</DropdownMenuTrigger>
					</div>
					<DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
						{["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
							<div key={index}>
								<DropdownMenuItem
									className='cursor-pointer'
									onClick={() =>
										setLayout(item.toLowerCase() as CallLayoutType)
									}
								>
									{item}
								</DropdownMenuItem>
								<DropdownMenuSeparator className='border-dark-1' />
							</div>
						))}
						<DropdownMenuSeparator />
					</DropdownMenuContent>
				</DropdownMenu>
				<CallStatsButton />
				<button onClick={() => setShowParticipants(prev => !prev)}>
					<div className='cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4C535B]'>
						<Users size={20} className='text-white' />
					</div>
				</button>

				{/* Кнопка включения/отключения транскрипции */}
				{isTranscriptionAvailable && (
					<button onClick={handleToggleTranscription}>
						<div
							className={cn(
								"cursor-pointer rounded-2xl px-4 py-2 transition-all flex items-center",
								{
									"bg-[#19232D] hover:bg-[#4C535B]": !isTranscribing,
									"bg-blue-600 hover:bg-blue-700": isTranscribing,
								}
							)}
						>
							<MicIcon size={20} className='text-white' />
						</div>
					</button>
				)}

				{/* Кнопка отображения транскрипции */}
				<button onClick={() => setShowTranscription(prev => !prev)}>
					<div
						className={cn(
							"cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4C535B]",
							{
								"bg-blue-600 hover:bg-blue-700": showTranscription,
							}
						)}
					>
						<FileText size={20} className='text-white' />
					</div>
				</button>

				{!isPersonalRoom && <EndCallButton />}
			</div>
		</section>
	);
};

export default MeetingRoom;

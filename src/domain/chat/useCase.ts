import { useChatStore} from "@/src/stores/chatStore";
import {SendMessage} from "@/src/domain/chat/service";

export async function regenerateAssistMessage(chatId: string, messageId: string) {
    const { loadChat, setIsLoading, addMessage, appendToLastMessage} = useChatStore();
    setIsLoading(true);
    try {
        const chat = await loadChat(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }

        const retryIndex = chat.messages.findIndex((m) => m.id === messageId);
        if (retryIndex === -1) {
            throw new Error('Message to retry not found');
        }

        const newMessages = chat.messages.slice(0, retryIndex);
        chat.messages = newMessages;

        const reader = await SendMessage(chatId, newMessages);
        await addMessage(chatId, { role: 'assistant', content: '' });
    }
}
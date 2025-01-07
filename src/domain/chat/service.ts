import {Message} from '@/src/stores/chatStore';


export async function SendMessage(chatId: string, messages: Message[]) {
    const response = await fetch(`/api/chat/${chatId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({messages}),
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }
}
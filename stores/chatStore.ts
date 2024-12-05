// stores/chatStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import * as idb from 'idb-keyval';

// Message interface with rendering state
export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    rendered: boolean;
}

// Chat interface with metadata
export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

interface ChatListItem {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

// Store interface
interface ChatStore {
    chatList: ChatListItem[];
    currentChatId: string | null;
    isLoading: boolean;
    initialized: boolean;

    // Store actions
    initialize: () => Promise<void>;
    createChat: () => Promise<string>;
    setCurrentChat: (chatId: string) => void;
    loadChat: (chatId: string) => Promise<Chat | null>;
    addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp' | 'rendered'>) => Promise<void>;
    setIsLoading: (loading: boolean) => void;
    appendToLastMessage: (chatId: string, content: string) => Promise<void>;
    updateChatTitle: (chatId: string, title: string) => Promise<void>;
    deleteChat: (chatId: string) => Promise<void>;
    markMessageAsRendered: (chatId: string, messageId: string) => Promise<void>;
}

// Storage constants
const CHAT_PREFIX = 'chat:';
const CHAT_LIST_KEY = 'chatList';

// Storage helper functions
const storage = {
    async getChatList(): Promise<ChatListItem[]> {
        const list = await idb.get<ChatListItem[]>(CHAT_LIST_KEY);
        return list || [];
    },

    async getChat(chatId: string): Promise<Chat | null> {
        const chat = await idb.get<Chat>(`${CHAT_PREFIX}${chatId}`);
        return chat || null;
    },

    async setChat(chat: Chat): Promise<void> {
        await idb.set(`${CHAT_PREFIX}${chat.id}`, chat);
    },

    async setChatList(list: ChatListItem[]): Promise<void> {
        await idb.set(CHAT_LIST_KEY, list);
    },

    async deleteChat(chatId: string): Promise<void> {
        await idb.del(`${CHAT_PREFIX}${chatId}`);
    }
};

export const useChatStore = create<ChatStore>((set, get) => ({
    chatList: [],
    currentChatId: null,
    isLoading: false,
    initialized: false,

    initialize: async () => {
        // Prevent redundant initialization
        if (get().initialized) return;

        try {
            console.log('Initializing chat store...');
            const chatList = await storage.getChatList();
            set({ chatList, initialized: true });
        } catch (error) {
            console.error('Failed to initialize chat store:', error);
            set({ initialized: true });
        }
    },

    createChat: async () => {
        const newChat: Chat = {
            id: uuidv4(),
            title: 'New Chat',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        try {
            await storage.setChat(newChat);

            const chatListItem: ChatListItem = {
                id: newChat.id,
                title: newChat.title,
                createdAt: newChat.createdAt,
                updatedAt: newChat.updatedAt
            };

            set((state) => ({
                chatList: [chatListItem, ...state.chatList],
                currentChatId: newChat.id
            }));

            await storage.setChatList(get().chatList);
            return newChat.id;
        } catch (error) {
            console.error('Failed to create chat:', error);
            throw error;
        }
    },

    setCurrentChat: (chatId) => {
        set({ currentChatId: chatId });
    },

    loadChat: async (chatId) => {
        try {
            return await storage.getChat(chatId);
        } catch (error) {
            console.error('Failed to load chat:', error);
            return null;
        }
    },

    addMessage: async (chatId, messageData) => {
        try {
            const chat = await storage.getChat(chatId);
            if (!chat) return;

            const message: Message = {
                ...messageData,
                id: uuidv4(),
                timestamp: Date.now(),
                rendered: false
            };

            const updatedChat = {
                ...chat,
                messages: [...chat.messages, message],
                updatedAt: new Date(),
                title: chat.messages.length === 0 && message.role === 'user'
                    ? message.content
                    : chat.title
            };

            await storage.setChat(updatedChat);

            if (chat.title !== updatedChat.title) {
                set((state) => ({
                    chatList: state.chatList.map(item =>
                        item.id === chatId
                            ? {
                                ...item,
                                title: updatedChat.title,
                                updatedAt: updatedChat.updatedAt
                            }
                            : item
                    )
                }));

                await storage.setChatList(get().chatList);
            }
        } catch (error) {
            console.error('Failed to add message:', error);
            throw error;
        }
    },

    setIsLoading: (loading) => {
        set({ isLoading: loading });
    },

    appendToLastMessage: async (chatId, content) => {
        try {
            const chat = await storage.getChat(chatId);
            if (!chat) return;

            const messages = [...chat.messages];
            const lastMessage = messages[messages.length - 1];

            if (lastMessage?.role === 'assistant') {
                messages[messages.length - 1] = {
                    ...lastMessage,
                    content: lastMessage.content + content
                };

                const updatedChat = { ...chat, messages, updatedAt: new Date() };
                await storage.setChat(updatedChat);
            }
        } catch (error) {
            console.error('Failed to append to message:', error);
            throw error;
        }
    },

    updateChatTitle: async (chatId, title) => {
        try {
            const chat = await storage.getChat(chatId);
            if (!chat) return;

            const updatedChat = { ...chat, title, updatedAt: new Date() };
            await storage.setChat(updatedChat);

            set((state) => ({
                chatList: state.chatList.map(item =>
                    item.id === chatId
                        ? { ...item, title, updatedAt: updatedChat.updatedAt }
                        : item
                )
            }));

            await storage.setChatList(get().chatList);
        } catch (error) {
            console.error('Failed to update chat title:', error);
            throw error;
        }
    },

    deleteChat: async (chatId) => {
        try {
            await storage.deleteChat(chatId);

            set((state) => ({
                chatList: state.chatList.filter(chat => chat.id !== chatId),
                currentChatId: state.currentChatId === chatId ? null : state.currentChatId
            }));

            await storage.setChatList(get().chatList);
        } catch (error) {
            console.error('Failed to delete chat:', error);
            throw error;
        }
    },

    markMessageAsRendered: async (chatId, messageId) => {
        try {
            const chat = await storage.getChat(chatId);
            if (!chat) return;

            const updatedMessages = chat.messages.map(msg =>
                msg.id === messageId ? { ...msg, rendered: true } : msg
            );

            const updatedChat = {
                ...chat,
                messages: updatedMessages,
                updatedAt: new Date()
            };

            await storage.setChat(updatedChat);
        } catch (error) {
            console.error('Failed to mark message as rendered:', error);
        }
    }
}));

// Initialize the store on the client side
if (typeof window !== 'undefined') {
    const state = useChatStore.getState();
    if (!state.initialized) {
        state.initialize().catch(error => {
            console.error('Failed to initialize chat store:', error);
        });
    }
}
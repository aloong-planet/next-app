'use client';

import React, {useState, useMemo, useRef, useEffect} from 'react';
import Link from 'next/link';
import {useChatStore} from '@/stores/chatStore';
import {useRouter, usePathname} from 'next/navigation';
import {Trash2, Pencil} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper function for date formatting
const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// New Chat Button component
const NewChatButton = ({
                           onNewChat,
                           isCreating,
                       }: {
    onNewChat: () => Promise<void>;
    isCreating: boolean;
}) => (
    <button
        onClick={onNewChat}
        disabled={isCreating}
        className="w-full py-2 px-4 bg-green-500 text-white shadow-md rounded hover:bg-green-600
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center"
    >
        {isCreating && <span className="inline-block animate-spin mr-2">⌛</span>}
        {isCreating ? 'Creating...' : 'New Chat'}
    </button>
);

// Chat Item component
const ChatItem = ({
                      chat,
                      isActive,
                      onDeleteClick,
                      onUpdateTitle,
                  }: {
    chat: { id: string; title: string; createdAt: Date; messages: any[] };
    isActive: boolean;
    onDeleteClick: (chatId: string) => void;
    onUpdateTitle: (chatId: string, newTitle: string) => Promise<void>;
}) => {
    const [showActions, setShowActions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(chat.title);
    const [isUpdating, setIsUpdating] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
        setEditTitle(chat.title);
    };

    const handleSave = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (editTitle.trim() === '') return;
        if (editTitle === chat.title) {
            setIsEditing(false);
            return;
        }

        try {
            setIsUpdating(true);
            await onUpdateTitle(chat.id, editTitle.trim());
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update chat title:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditTitle(chat.title);
        }
    };

    return (
        <div
            className={`relative group block rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isActive ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => !isEditing && setShowActions(false)}
        >
            {isEditing ? (
                <form onSubmit={handleSave} className="p-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => setIsEditing(false)}
                        disabled={isUpdating}
                        className="w-full px-2 py-1 text-sm rounded border
                            bg-white dark:bg-gray-800
                            border-gray-300 dark:border-gray-600
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter chat title (Enter to save, Esc to cancel)"
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{formatDate(chat.createdAt)}</span>
                        <span>|</span>
                        <span>{chat.messages?.length || 0} message{chat.messages?.length !== 1 ? 's' : ''}</span>
                    </div>
                </form>
            ) : (
                <>
                    <Link
                        href={`/chat/${chat.id}`}
                        className="block p-3"
                    >
                        <div className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                            {chat.title || 'New Conversation'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <div className="min-w-[70px]">
                                <span>{formatDate(chat.createdAt)}</span>
                            </div>
                            <span>|</span>
                            <span>{chat.messages?.length || 0} message{chat.messages?.length !== 1 ? 's' : ''}</span>
                        </div>
                    </Link>

                    {/* Action buttons */}
                    <div
                        className={`absolute right-2 bottom-1.5 
                            flex items-center border rounded-md overflow-hidden
                            border-gray-200 dark:border-gray-600
                            bg-white dark:bg-gray-800
                            ${showActions ? 'block' : 'hidden'}`}
                    >
                        <button
                            onClick={handleEditClick}
                            className="p-1
                                hover:bg-blue-100 dark:hover:bg-blue-900/30
                                text-blue-600 dark:text-blue-400
                                border-r border-gray-200 dark:border-gray-600"
                            aria-label="Edit chat title"
                        >
                            <Pencil className="w-3 h-3"/>
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDeleteClick(chat.id);
                            }}
                            className="p-1
                                hover:bg-red-100 dark:hover:bg-red-900/30
                                text-red-600 dark:text-red-400"
                            aria-label="Delete chat"
                        >
                            <Trash2 className="w-3 h-3"/>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// Main ChatList component
export const ChatList = () => {
    const {chatList, createChat, deleteChat, updateChatTitle, initialized, loadChat} = useChatStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isCreating, setIsCreating] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<string | null>(null);
    const [fullChatData, setFullChatData] = useState<Record<string, any>>({});

    // Update full chat data whenever chat list changes or when current chat ID changes
    useEffect(() => {
        const loadFullChatData = async () => {
            const data: Record<string, any> = {};
            for (const chat of chatList) {
                try {
                    const fullChat = await loadChat(chat.id);
                    if (fullChat) {
                        data[chat.id] = fullChat;
                    }
                } catch (error) {
                    console.error(`Failed to load chat ${chat.id}:`, error);
                }
            }
            setFullChatData(data);
        };

        loadFullChatData();

        const intervalId = setInterval(loadFullChatData, 10000);
        return () => clearInterval(intervalId);

    }, [chatList, loadChat]);

    const handleNewChat = async () => {
        try {
            setIsCreating(true);
            const newChatId = await createChat();
            router.push(`/chat/${newChatId}`);
        } catch (error) {
            console.error('Failed to create new chat:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (chatToDelete) {
            try {
                await deleteChat(chatToDelete);
                if (pathname === `/chat/${chatToDelete}`) {
                    router.push('/chat');
                }
            } catch (error) {
                console.error('Failed to delete chat:', error);
            } finally {
                setChatToDelete(null);
            }
        }
    };

    const handleUpdateTitle = async (chatId: string, newTitle: string) => {
        try {
            await updateChatTitle(chatId, newTitle);
        } catch (error) {
            console.error('Failed to update chat title:', error);
            throw error;
        }
    };

    const renderedChatList = useMemo(() => {
        return chatList.map((chat) => {
            const fullChat = fullChatData[chat.id] || {...chat, messages: []};
            return (
                <ChatItem
                    key={chat.id}
                    chat={fullChat}
                    isActive={pathname === `/chat/${chat.id}`}
                    onDeleteClick={(chatId) => setChatToDelete(chatId)}
                    onUpdateTitle={handleUpdateTitle}
                />
            );
        });
    }, [chatList, pathname, fullChatData]);

    if (!initialized) {
        return (
            <div className="flex flex-col h-full">
                <div className="shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
                    <NewChatButton onNewChat={handleNewChat} isCreating={isCreating}/>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
                    <NewChatButton onNewChat={handleNewChat} isCreating={isCreating}/>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-2">
                        {!chatList || chatList.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                                No chats yet. Start a new conversation!
                            </div>
                        ) : (
                            renderedChatList
                        )}
                    </div>
                </div>
            </div>

            <AlertDialog open={!!chatToDelete} onOpenChange={() => setChatToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this chat? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
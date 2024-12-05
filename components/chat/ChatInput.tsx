// ChatInput.tsx
'use client';

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { CircleStop, Send } from 'lucide-react';

interface ChatInputProps {
    chatId: string;
    refreshMessages: () => Promise<void>;
    onResize?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ chatId, refreshMessages, onResize }) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { addMessage, setIsLoading, appendToLastMessage, loadChat } = useChatStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Handle textarea auto-resize
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        const parent = textarea?.parentElement;
        if (textarea && parent) {
            // Reset height to calculate proper scrollHeight
            parent.style.height = 'auto';

            // Set the height based on content
            const newHeight = Math.min(Math.max(24, parent.scrollHeight), 300);
            parent.style.height = `${newHeight}px`;

            // Handle overflow
            textarea.style.overflow = newHeight >= 300 ? 'auto' : 'hidden';

            onResize?.();
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsProcessing(false);
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        setError(null);
        setIsProcessing(true);
        setIsLoading(true);

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        const userMessage = { role: 'user' as const, content: input.trim() };
        setInput('');

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        try {
            await addMessage(chatId, userMessage);
            await refreshMessages();

            const currentChat = await loadChat(chatId);
            if (!currentChat) throw new Error('Chat not found');

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId,
                    messages: currentChat.messages
                }),
                signal, // Add abort signal to fetch request
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to send message');
            }

            if (!response.body) throw new Error('No response body available');

            await addMessage(chatId, { role: 'assistant', content: '' });
            await refreshMessages();

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                if (chunk.startsWith('event: error')) {
                    const errorData = JSON.parse(chunk.split('\n')[1].slice(5));
                    throw new Error(errorData.error.message);
                }

                await appendToLastMessage(chatId, chunk);
                await refreshMessages();
            }
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                console.log('Request aborted');
            } else {
                const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                setError(errorMessage);
                console.error('Chat error:', error);
            }
        } finally {
            setIsLoading(false);
            setIsProcessing(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className="space-y-2 max-w-3xl mx-auto px-4">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="relative">
                <div className={cn(
                    "relative flex flex-col",
                    "bg-white dark:bg-gray-800",
                    "rounded-xl border border-gray-200 dark:border-gray-700",
                    "transition-colors duration-200",
                    "hover:border-gray-300 dark:hover:border-gray-600"
                )}>
                    {/* Main input area */}
                    <div className="grid grid-cols-[1fr,auto] gap-2 p-2">
                        {/* Textarea container */}
                        <div className="relative min-h-[24px]">
                            <div className="absolute inset-0 invisible whitespace-pre-wrap break-words">
                                {input + ' '}
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    adjustTextareaHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                className={cn(
                                    "absolute inset-0 w-full h-full",
                                    "px-3 py-2",
                                    "bg-transparent",
                                    "resize-none focus:outline-none",
                                    "placeholder:text-gray-500",
                                    "disabled:opacity-50",
                                    "overflow-hidden"
                                )}
                                placeholder="Type something to start chat..."
                                disabled={isProcessing}
                                rows={1}
                            />
                        </div>

                        {/* Send/Stop button container */}
                        <div className={cn(
                            "self-start mt-2",
                            "transition-opacity duration-200",
                            (!input.trim() && !isProcessing) ? "opacity-0" : "opacity-100"
                        )}>
                            <button
                                type={isProcessing ? 'button' : 'submit'}
                                onClick={isProcessing ? handleStopGeneration : undefined}
                                disabled={!input.trim() && !isProcessing}
                                className={cn(
                                    "p-1.5 rounded-lg",
                                    "text-white",
                                    "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
                                    "transition-colors",
                                    "disabled:opacity-0"
                                )}
                            >
                                {isProcessing ? (
                                    <CircleStop className="w-4 h-4" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Bottom hint */}
                    <div className="px-3 py-1.5 text-right text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700">
                        Use <kbd className="px-0.5 text-xs font-mono bg-orange-200 bg-opacity-80 dark:bg-orange-400 rounded">return</kbd> to send, <kbd className="px-0.5 text-xs font-mono bg-orange-200 bg-opacity-80 dark:bg-orange-400 rounded">shift+return</kbd> for new line
                    </div>
                </div>
            </form>
        </div>
    );
};
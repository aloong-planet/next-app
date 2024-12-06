// ChatContainer.tsx
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ScrollToBottomButton } from './ScrollToBottomButton';
import { useChatStore } from '@/src/stores/chatStore';
import { useParams } from 'next/navigation';
import type { Chat } from '@/src/stores/chatStore';
import { cn } from '@/src/lib/utils';

export const ChatContainer: React.FC = () => {
    const params = useParams<{ id: string }>();
    const chatId = params.id;
    const { setCurrentChat, loadChat, initialized } = useChatStore();
    const [currentChatData, setCurrentChatData] = useState<Chat | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const initialScrollDoneRef = useRef(false);
    const scrollCheckThreshold = 100;

    // Scroll to bottom of messages
    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'instant') => {
        const container = scrollContainerRef.current;
        if (container) {
            try {
                const targetScroll = container.scrollHeight;
                container.scrollTo({
                    top: targetScroll,
                    behavior,
                });
            } catch (error) {
                console.error('Scroll error:', error);
            }
        }
    }, []);

    // Check if scroll is near bottom
    const isNearBottom = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return true;

        return container.scrollHeight - container.scrollTop - container.clientHeight < scrollCheckThreshold;
    }, [scrollCheckThreshold]);

    // Handle scroll position and update button visibility
    const handleScroll = useCallback(() => {
        const shouldShow = !isNearBottom();
        setShowScrollButton(shouldShow);
    }, [isNearBottom]);

    // Perform initial scroll
    const performInitialScroll = useCallback(() => {
        if (!initialScrollDoneRef.current && !isLoading && currentChatData) {
            requestAnimationFrame(() => {
                scrollToBottom('instant');
                initialScrollDoneRef.current = true;
                handleScroll();
            });
        }
    }, [isLoading, currentChatData, scrollToBottom, handleScroll]);

    // Load chat data
    const refreshChatData = async () => {
        if (chatId && initialized) {
            try {
                const chat = await loadChat(chatId);
                if (chat) {
                    setCurrentChatData(chat);
                    setCurrentChat(chatId);
                }
            } catch (error) {
                console.error('Failed to load chat:', error);
            }
        }
    };

    // Initial load effect
    useEffect(() => {
        const loadCurrentChat = async () => {
            if (chatId && initialized) {
                setIsLoading(true);
                initialScrollDoneRef.current = false;
                await refreshChatData();
                setIsLoading(false);
            }
        };

        loadCurrentChat();
    }, [chatId, initialized]);

    // Perform initial scroll after data is loaded
    useEffect(() => {
        performInitialScroll();
    }, [performInitialScroll]);

    // Add scroll event listener
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    // Reset scroll flag when chat changes
    useEffect(() => {
        return () => {
            initialScrollDoneRef.current = false;
        };
    }, [chatId]);

    if (!initialized || isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading chat...</p>
            </div>
        );
    }

    if (!currentChatData) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Chat not found</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col overflow-hidden">
            {/* Message section wrapper */}
            <div className="flex-1 min-h-0 relative">
                {/* Scrollable message list container */}
                <div
                    ref={scrollContainerRef}
                    className="absolute inset-0 overflow-y-auto"
                    onScroll={handleScroll}
                >
                    {/* Max-width container with centering */}
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        {/* Message content wrapper */}
                        <div className="space-y-6">
                            <MessageList messages={currentChatData.messages} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Button and Input container wrapper */}
            <div className="shrink-0 relative">
                {/* Scroll button positioned above input */}
                <div className="absolute -top-12 right-8 z-10">
                    <ScrollToBottomButton
                        show={showScrollButton}
                        onClick={() => scrollToBottom()}
                    />
                </div>

                {/* Input container */}
                <div className={cn(
                    "bg-background/80 backdrop-blur-sm",
                    "px-4 py-0 transition-all duration-200"
                )}>
                    <ChatInput
                        chatId={chatId}
                        refreshMessages={async () => {
                            await refreshChatData();
                            if (isNearBottom()) {
                                scrollToBottom();
                            }
                        }}
                        onResize={() => {
                            if (isNearBottom()) {
                                scrollToBottom();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

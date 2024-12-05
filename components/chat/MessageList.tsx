// components/chat/MessageList.tsx
import React, { Suspense } from 'react';
import { Message } from '@/stores/chatStore';
import { MarkdownPreview } from './MarkdownPreview';
import { cn } from '@/lib/utils';

interface MessageListProps {
    messages: Message[];
}

// Error boundary for individual message
class MessageErrorBoundary extends React.Component<{
    children: React.ReactNode;
    fallback: React.ReactNode;
    messageId: string;
}, {
    hasError: boolean;
    error?: Error;
}> {
    state = { hasError: false, error: undefined };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(`Message ${this.props.messageId} render error:`, error, errorInfo);
    }

    reset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-sm text-red-500 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p>Failed to render message</p>
                    <div className="mt-2 text-xs whitespace-pre-wrap overflow-auto max-h-[200px]">
                        {this.props.fallback}
                    </div>
                    <button
                        onClick={this.reset}
                        className="mt-2 text-xs text-blue-500 hover:text-blue-600"
                    >
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Message item component
const MessageItem = React.memo<{ message: Message }>(({ message }) => {
    return (
        <div
            className={cn(
                "flex",
                message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
        >
            <div
                className={cn(
                    "px-4 py-1 rounded-lg",
                    "max-w-[95%] w-fit",
                    message.role === 'user'
                        ? 'bg-sky-100 dark:bg-sky-900/30 shadow-md dark:shadow-sky-900/40 border border-black/10 dark:border-sky-800'
                        : 'bg-gray-50 dark:bg-gray-800 shadow-md dark:shadow-gray-900/40 border border-black/10 dark:border-gray-700', // Added border
                    "transition-colors duration-200" // Smooth transition for dark mode
                )}
            >
                <MessageErrorBoundary
                    messageId={message.id}
                    fallback={message.content}
                >
                    <Suspense
                        fallback={
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            </div>
                        }
                    >
                        <div className="prose dark:prose-invert max-w-none">
                            <MarkdownPreview
                                content={message.content}
                                className="break-words"
                            />
                        </div>
                    </Suspense>
                </MessageErrorBoundary>
            </div>
        </div>
    );
});

MessageItem.displayName = 'MessageItem';

// Main MessageList component
export const MessageList = React.memo<MessageListProps>(({ messages }) => {
    if (messages.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                Start a conversation by typing a message below.
            </div>
        );
    }

    return (
        <div className="space-y-4 min-h-full w-full">
            {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
            ))}
        </div>
    );
});

MessageList.displayName = 'MessageList';
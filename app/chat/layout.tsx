// app/chat/layout.tsx
'use client';

import { ChatList } from '@/components/chat/ChatList';

export default function ChatLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-full">
            {/* ChatList will always show regardless of chat content errors */}
            <aside className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
                <ChatList />
            </aside>
            {/* Chat content area with error boundary */}
            <main className="flex-1 flex flex-col h-full">
                {children}
            </main>
        </div>
    );
}

// components/chat/UserMessagesDialog.tsx
import React from 'react';
import { MessageCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog"

interface UserMessagesDialogProps {
    messages: Array<{
        id: string;
        role: 'user' | 'assistant';
        content: string;
    }>;
    onMessageClick: (messageId: string) => void;
}

export const UserMessagesDialog: React.FC<UserMessagesDialogProps> = ({
                                                                          messages,
                                                                          onMessageClick,
                                                                      }) => {
    const userMessages = messages.filter(msg => msg.role === 'user');

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Show user messages"
                >
                    <MessageCircle className="w-5 h-5" />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>User Messages</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto mt-4 space-y-2">
                    {userMessages.map((message, index) => (
                        <button
                            key={message.id}
                            onClick={() => onMessageClick(message.id)}
                            className="w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="text-sm font-medium">
                                Message {index + 1}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {message.content}
                            </div>
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
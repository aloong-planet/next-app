import {ChatContainer} from '@/components/chat/ChatContainer';
import {Suspense} from "react";

export default function ChatPage() {
    return (
        <Suspense>
            <ChatContainer/>
        </Suspense>
    );
}
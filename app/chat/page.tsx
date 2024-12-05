import {Suspense} from "react";

export default function ChatIndexPage() {
    return (
        <Suspense>
            <div className="flex items-center justify-center h-full text-gray-500">
                Select a chat or start a new conversation
            </div>
        </Suspense>
    );
}
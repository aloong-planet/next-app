// app/chat/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Chat not found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                    The chat you're looking for doesn't exist or has been deleted.
                </p>
                <Link
                    href="/chat"
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors inline-block"
                >
                    Go to Chats
                </Link>
            </div>
        </div>
    );
}
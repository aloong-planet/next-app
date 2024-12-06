import React from 'react';
import { cn } from '@/src/lib/utils';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomButtonProps {
    className?: string;
    show: boolean;
    onClick: () => void;
}

export const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
                                                                              className,
                                                                              show,
                                                                              onClick,
                                                                          }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                // Basic button styling
                "p-2 rounded-full",
                "bg-white dark:bg-gray-800",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "transition-all duration-200",
                "shadow-lg",

                // Border and outline
                "border border-gray-200 dark:border-gray-700",
                // "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",

                // Icon container
                "flex items-center justify-center",

                // Animation and visibility
                "transform opacity-0 scale-95 pointer-events-none",
                show && "opacity-100 scale-100 pointer-events-auto",
                className
            )}
            aria-label="Scroll to bottom"
        >
            <ChevronDown
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
                strokeWidth={2}
            />
        </button>
    );
};
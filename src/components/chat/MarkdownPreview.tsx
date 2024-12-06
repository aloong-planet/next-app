import React, {useMemo, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import type {Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneDark} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {useTheme} from 'next-themes';
import {cn} from '@/src/lib/utils';
import 'katex/dist/katex.min.css';

interface MarkdownPreviewProps {
    content: string;
    className?: string;
    onRendered?: () => void;
    onError?: (error: Error) => void;
}

interface CodeBlockProps {
    language: string;
    code: string;
}

// Code block component with copy functionality
const CodeBlock: React.FC<CodeBlockProps> = React.memo(({language, code}) => {
    const {theme} = useTheme();

    return (
        <div className={cn(
            "relative rounded-lg overflow-hidden",
            "border border-gray-300 dark:border-gray-700",
            "transition-colors duration-200",
            "bg-white dark:bg-gray-800"
        )}>
            <div className={cn(
                "flex items-center justify-between",
                "px-3 py-1",
                "bg-gray-50 dark:bg-gray-900",
                "transition-colors duration-200"
            )}>
                <span className="text-xs font-mono text-gray-800 dark:text-gray-200">
                    {language}
                </span>
                <CopyButton code={code}/>
            </div>
            <SyntaxHighlighter
                style={theme === 'dark' ? oneDark : oneDark}
                language={language}
                PreTag="div"
                showLineNumbers
                customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    padding: '1rem',
                    fontSize: '0.8rem',
                    maxWidth: '100%',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    whiteSpace: 'pre',
                    wordWrap: 'normal',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'thin',
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
});

CodeBlock.displayName = 'CodeBlock';

interface CopyButtonProps {
    code: string;
}

// Copy button component
const CopyButton: React.FC<CopyButtonProps> = React.memo(({code}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = React.useCallback(() => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        });
    }, [code]);

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "px-3 py-1",
                "text-xs font-medium rounded-md",
                "border border-gray-200 dark:border-gray-600",
                "bg-white dark:bg-gray-800",
                "text-gray-600 dark:text-gray-300",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "transition-all duration-200",
                copied && "text-green-600 dark:text-green-400"
            )}
        >
            {copied ? 'Copied' : 'Copy'}
        </button>
    );
});

CopyButton.displayName = 'CopyButton';

// Main MarkdownPreview component
export const MarkdownPreview: React.FC<MarkdownPreviewProps> = React.memo(({
                                                                               content,
                                                                               className,
                                                                               onRendered,
                                                                               onError
                                                                           }) => {
    const {theme} = useTheme();

    useEffect(() => {
        onRendered?.();
    }, [onRendered]);

    // Markdown components configuration with proper typing
    const markdownComponents: Partial<Components> = useMemo(
        () => ({
            // Properly typed pre component
            pre: ({children, ...props}) => (
                <pre {...props}>
                    {children}
                </pre>
            ),
            // Properly typed code component
            code: ({inline, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const codeContent = String(children).replace(/\n$/, '');

                if (!inline && match) {
                    const language = match[1];
                    return <CodeBlock language={language} code={codeContent}/>;
                }

                return (
                    <code
                        className={cn(
                            "before:content-none after:content-none",
                            inline ? "bg-muted rounded px-1 py-0.5" : "",
                            className
                        )}
                        {...props}
                    >
                        {codeContent}
                    </code>
                );
            },
        }),
        [theme]
    );

    const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
    const rehypePlugins = useMemo(() => [rehypeKatex, rehypeRaw], []);

    try {
        return (
            <ReactMarkdown
                className={cn(
                    // Base typography
                    "prose dark:prose-invert prose-sm max-w-none",
                    "transition-colors duration-200",
                    // Spacing
                    "!my-0 !mx-0",
                    // Paragraph styles
                    "prose-p:leading-relaxed prose-p:my-1",
                    // Heading styles
                    "prose-headings:font-semibold prose-headings:my-4",
                    "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
                    // List styles
                    "prose-ul:my-3 prose-ol:my-3",
                    "prose-li:my-1",
                    // Code styles
                    "prose-code:px-1.5 prose-code:py-0.5",
                    "prose-code:rounded-md",
                    "prose-code:text-gray-900 dark:prose-code:text-gray-100",
                    "prose-code:before:content-none prose-code:after:content-none",
                    // Pre styles for code blocks
                    "prose-pre:!p-0 prose-pre:!m-0 prose-pre:!bg-transparent",
                    "prose-pre:!rounded-lg overflow-hidden",
                    // Link styles
                    "prose-a:text-blue-600 dark:prose-a:text-blue-400",
                    "prose-a:no-underline hover:prose-a:underline",

                    className
                )}
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                components={markdownComponents}
            >
                {content}
            </ReactMarkdown>
        );
    } catch (error) {
        onError?.(error as Error);
        return <div className="whitespace-pre-wrap">{content}</div>;
    }
});

MarkdownPreview.displayName = 'MarkdownPreview';
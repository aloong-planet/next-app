// app/infos/components/ExchangeRateWidget.tsx
'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useExchangeRateStore } from '@/stores/exchangeRateStore';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowRight, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CurrencySelect } from './CurrencySelect';

export function ExchangeRateWidget() {
    const {
        selectedSource,
        selectedDestination,
        currentRate,
        isLoading,
        error,
        isReversed,
        setSource,
        setDestination,
        toggleDirection,
        fetchExchangeRate
    } = useExchangeRateStore();

    // Refresh rate handler with error handling
    const handleRefresh = useCallback(async () => {
        try {
            await fetchExchangeRate();
        } catch (error) {
            console.error('Failed to refresh exchange rate:', error);
        }
    }, [fetchExchangeRate]);

    // Auto-refresh effect with proper cleanup and error handling
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const setupInterval = () => {
            handleRefresh();
            intervalId = setInterval(handleRefresh, 600000); // Refresh every 10 minute
        };

        setupInterval();

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [handleRefresh, selectedSource, selectedDestination]);

    // Format timestamp for better readability
    const formattedTimestamp = useMemo(() => {
        if (!currentRate?.lastUpdated) return '';
        return new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }).format(currentRate.lastUpdated);
    }, [currentRate?.lastUpdated]);

    return (
        <Card className={cn(
            "w-full max-w-xl overflow-hidden",
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md",
            "border border-white/20 dark:border-gray-700/20",
            "shadow-lg shadow-black/5 dark:shadow-black/10",
            "rounded-2xl transition-all duration-300 ease-in-out",
            "hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90",
        )}>
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle
                        className="text-sm font-medium text-gray-900 dark:text-gray-100"
                        id="exchange-rate-title"
                    >
                        Exchange Rate
                    </CardTitle>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        aria-label="Refresh exchange rate"
                        className={cn(
                            "p-1.5 rounded-full",
                            "text-gray-500 dark:text-gray-400",
                            "hover:bg-black/5 dark:hover:bg-white/5",
                            "transition-colors duration-200",
                            "disabled:opacity-50",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        )}
                    >
                        <RefreshCw
                            className={cn(
                                "w-3.5 h-3.5",
                                isLoading && "animate-spin"
                            )}
                        />
                    </button>
                </div>
            </CardHeader>

            <CardContent className="p-2 pt-2">
                <div
                    className="flex items-center gap-2 justify-between"
                    role="form"
                    aria-labelledby="exchange-rate-title"
                >
                    <CurrencySelect
                        value={selectedSource}
                        onValueChange={setSource}
                        placeholder="Source currency"
                        disabled={isLoading}
                    />

                    <button
                        onClick={toggleDirection}
                        className={cn(
                            "p-1 rounded-full",
                            "transition-colors duration-200",
                            "hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                        aria-label="Toggle exchange direction"
                    >
                        {isReversed ? (
                            <ArrowLeft className="w-3.5 h-3.5 text-gray-400"/>
                        ) : (
                            <ArrowRight className="w-3.5 h-3.5 text-gray-400"/>
                        )}
                    </button>
                    <CurrencySelect
                        value={selectedDestination}
                        onValueChange={setDestination}
                        placeholder="Target currency"
                        disabled={isLoading}
                    />
                </div>

                <div className="mt-4 text-center">
                    {error ? (
                        <div className={cn(
                            "p-2 rounded-lg",
                            "flex items-center justify-center gap-2",
                            "text-red-600 dark:text-red-400",
                            "bg-red-50 dark:bg-red-900/20"
                        )}>
                        <AlertCircle className="w-4 h-4" />
                            <span className="text-xs">{error}</span>
                            <button
                                onClick={handleRefresh}
                                className="text-xs underline hover:text-red-700 dark:hover:text-red-300"
                            >
                                Retry
                            </button>
                        </div>
                    ) : isLoading && !currentRate ? (
                        <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                            Loading exchange rate...
                        </div>
                    ) : currentRate ? (
                        <>
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                <div>
                                    1 {currentRate.source} = {currentRate.rate.toFixed(4)} {currentRate.destination}
                                </div>
                                <div>
                                    1 {currentRate.destination} = { (1/currentRate.rate).toFixed(4)} {currentRate.source}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Last updated: {formattedTimestamp}
                            </div>
                        </>
                    ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Select currencies to view rate
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
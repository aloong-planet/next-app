// app/api/infos/exchange_rate/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_CACHE = new Map<string, { rates: Record<string, number>; timestamp: number }>();

const QuerySchema = z.object({
    source: z.string().length(3).toUpperCase(),
});

const SUPPORTED_CURRENCIES = new Set([
    'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'HKD', 'NZD'
]);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const source = searchParams.get('source');

        const validationResult = QuerySchema.safeParse({ source });
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid currency code' },
                { status: 400 }
            );
        }

        const { source: validSource } = validationResult.data;

        if (!SUPPORTED_CURRENCIES.has(validSource)) {
            return NextResponse.json(
                { error: 'Unsupported currency code' },
                { status: 400 }
            );
        }

        // Check cache
        const cachedData = RATE_CACHE.get(validSource);
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
            return NextResponse.json({ rates: cachedData.rates });
        }

        // Fetch exchange rates
        const apiKey = process.env.EXCHANGE_RATE_API_KEY;
        if (!apiKey) {
            throw new Error('Exchange rate API key not configured');
        }

        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${validSource}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        const rates = data.conversion_rates;

        // Update cache
        RATE_CACHE.set(validSource, {
            rates,
            timestamp: Date.now(),
        });

        return NextResponse.json({ rates });
    } catch (error) {
        console.error('Exchange rate API error:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
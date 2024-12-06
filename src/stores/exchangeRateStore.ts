// stores/exchangeRateStore.ts
import { create } from 'zustand';

interface ExchangeRate {
    source: string;
    destination: string;
    rate: number;
    lastUpdated: Date;
}

interface ExchangeRateStore {
    selectedSource: string;
    selectedDestination: string;
    currentRate: ExchangeRate | null;
    isLoading: boolean;
    error: string | null;
    isReversed: boolean;
    allRates: Record<string, number>;

    setSource: (country: string) => void;
    setDestination: (country: string) => void;
    toggleDirection: () => void;
    fetchExchangeRate: () => Promise<void>;
}

export const useExchangeRateStore = create<ExchangeRateStore>((set, get) => ({
    selectedSource: 'USD',
    selectedDestination: 'CNY',
    currentRate: null,
    isLoading: false,
    error: null,
    isReversed: false,
    allRates: {},

    setSource: (country) => {
        set({ selectedSource: country });
        get().fetchExchangeRate();
    },

    setDestination: (country) => {
        set({ selectedDestination: country });
        const { allRates } = get();
        if (Object.keys(allRates).length > 0) {
            set(state => ({
                currentRate: {
                    source: state.selectedSource,
                    destination: country,
                    rate: state.isReversed ? 1 / allRates[country] : allRates[country],
                    lastUpdated: new Date()
                }
            }));
        }
    },

    toggleDirection: () => {
        set(state => {
            const newIsReversed = !state.isReversed;
            if (state.currentRate) {
                return {
                    isReversed: newIsReversed,
                    currentRate: {
                        ...state.currentRate,
                        rate: 1 / state.currentRate.rate,
                    }
                };
            }
            return { isReversed: newIsReversed };
        });
    },

    fetchExchangeRate: async () => {
        const { selectedSource, selectedDestination, isReversed } = get();

        set({ isLoading: true, error: null });

        try {
            const source = isReversed ? selectedDestination : selectedSource;

            const response = await fetch(`/api/infos/exchange_rate?source=${source}`);

            if (!response.ok) {
                throw new Error('Failed to fetch exchange rates');
            }

            const data = await response.json();
            const rates = data.rates;

            const targetRate = isReversed ? 1 / rates[selectedSource] : rates[selectedDestination];

            set({
                allRates: rates,
                currentRate: {
                    source: selectedSource,
                    destination: selectedDestination,
                    rate: targetRate,
                    lastUpdated: new Date()
                },
                isLoading: false
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            });
        }
    }
}));
// app/infos/page.tsx
import { ExchangeRateWidget } from './components/ExchangeRateWidget';

export default function InfosPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <div className="container max-w-7xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
                    Widgets
                </h1>
                <div className="grid gap-6">
                    <div className="w-full max-w-fit mx-auto">
                        <ExchangeRateWidget />
                    </div>
                    {/* Add other widgets here */}
                </div>
            </div>
        </div>
    );
}
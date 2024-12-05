// app/infos/components/CurrencySelect.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Types and constants
export interface Currency {
  code: string;
  name: string;
}

export const CURRENCIES: readonly Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'BRL', name: 'Brazilian Real' }
] as const;

// Component props interface
interface CurrencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CurrencySelect({
  value,
  onValueChange,
  placeholder = 'Select currency',
  disabled = false,
  className,
}: CurrencySelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn(
        "h-7 text-xs min-w-[140px] flex-1",
        "border-gray-200/50 dark:border-gray-700/50",
        "bg-white/50 dark:bg-gray-800/50",
        "hover:bg-white/80 dark:hover:bg-gray-800/80",
        "focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700",
        className
      )}>
        <SelectValue
          placeholder={placeholder}
          aria-label={placeholder}
          className="truncate"
        />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map(({ code, name }) => (
          <SelectItem
            key={code}
            value={code}
            className="text-xs py-0.5"
          >
            {code} - {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
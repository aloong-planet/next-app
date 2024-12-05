// services/cacheService.ts
export class CacheService {
    private static instance: CacheService;
    private cache: Map<string, { data: any; timestamp: number }>;
    private readonly DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes

    private constructor() {
        this.cache = new Map();
    }

    public static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    set(key: string, data: any, ttl: number = this.DEFAULT_TTL) {
        this.cache.set(key, {
            data,
            timestamp: Date.now() + ttl
        });
    }

    get(key: string): any | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.timestamp) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    delete(key: string) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}
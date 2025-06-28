import crypto from 'crypto';
import { ApplicantsCompareResponse } from '../types/AiResponses';

// Simple in-memory cache implementation
interface CacheItem {
    data: ApplicantsCompareResponse;
    timestamp: number;
    ttl: number;
}

class SimpleCache {
    private cache: Map<string, CacheItem> = new Map();
    private defaultTTL = 3600000; // 1 hour in milliseconds

    set(key: string, data: ApplicantsCompareResponse, ttl?: number): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.defaultTTL
        });
    }

    get(key: string): ApplicantsCompareResponse | null {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }

        // Check if expired
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    // Clean expired items
    cleanup(): void {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.ttl) {
                this.cache.delete(key);
            }
        }
    }
}

export const cache = new SimpleCache();

// Run cleanup every 10 minutes
setInterval(() => cache.cleanup(), 600000);

// ...rest of the implementation is the same...
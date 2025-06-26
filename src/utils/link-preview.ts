import { LinkPreview } from "../types/LinkPreview";
import { load } from 'cheerio';
import Logger from "./logger";

export const fetchLinkPreview = async (url: string): Promise<LinkPreview | null> => {
    try {
        Logger.log(`Fetching link preview for: ${url}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduce timeout

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; CV-Bot/1.0)'
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Only read first chunk of response to avoid memory issues
        const text = await response.text();
        if (text.length > 500000) { // 500KB limit
            throw new Error('Response too large');
        }

        const $ = load(text);

        const preview: LinkPreview = {
            url: url,
            title: $('meta[property="og:title"]').attr('content') ||
                $('meta[name="twitter:title"]').attr('content') ||
                $('title').text()?.substring(0, 200) || // Limit title length
                'No title',
            description: $('meta[property="og:description"]').attr('content') ||
                $('meta[name="twitter:description"]').attr('content') ||
                $('meta[name="description"]').attr('content')?.substring(0, 300) || // Limit description
                '',
            image: $('meta[property="og:image"]').attr('content') ||
                $('meta[name="twitter:image"]').attr('content')
        };

        return preview;
    } catch (error: any) {
        Logger.error(`Failed to fetch link preview for ${url}:`, error.message);
        return null;
    }
};
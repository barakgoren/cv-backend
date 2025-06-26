import { LinkPreview } from "../types/LinkPreview";
import { load } from 'cheerio';
import Logger from "./logger";

export const fetchLinkPreview = async (url: string): Promise<LinkPreview | null> => {
    try {
        Logger.log(`Fetching link preview for: ${url}`);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = load(html);

        const preview: LinkPreview = {
            url: url,
            title: $('meta[property="og:title"]').attr('content') ||
                $('meta[name="twitter:title"]').attr('content') ||
                $('title').text() ||
                'No title found',
            description: $('meta[property="og:description"]').attr('content') ||
                $('meta[name="twitter:description"]').attr('content') ||
                $('meta[name="description"]').attr('content') ||
                'No description found',
            image: $('meta[property="og:image"]').attr('content') ||
                $('meta[name="twitter:image"]').attr('content'),
            siteName: $('meta[property="og:site_name"]').attr('content')
        };

        Logger.log('Link preview fetched successfully:', preview);
        return preview;

    } catch (error) {
        Logger.error('Error fetching link preview:', error);
        return null;
    }
}
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface NewsItem {
  title: string;
  description: string;
  link: string;
  imageUrl?: string;
  date: string;
  source: string;
}

// Cache the news for 1 hour
let cachedNews: NewsItem[] = [];
let lastFetched: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

async function scrapeNews(): Promise<NewsItem[]> {
  try {
    // Fetch news from SRM AP website
    const response = await fetch('https://srmap.edu.in/news/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const news: NewsItem[] = [];

    // Select news articles
    $('.post').each(function() {
      const title = $(this).find('.entry-title a').text().trim();
      const link = $(this).find('.entry-title a').attr('href') || '';
      const description = $(this).find('.entry-content p').first().text().trim();
      const date = $(this).find('.entry-date').text().trim();
      const imageUrl = $(this).find('img').first().attr('src');

      if (title && link) {
        news.push({
          title,
          description,
          link,
          imageUrl,
          date,
          source: 'SRM University AP'
        });
      }
    });

    return news;
  } catch (error) {
    console.error('Error scraping news:', error);
    return [];
  }
}

export async function GET() {
  try {
    // Check if cache is valid
    const now = Date.now();
    if (cachedNews.length === 0 || now - lastFetched > CACHE_DURATION) {
      // Fetch fresh news
      cachedNews = await scrapeNews();
      lastFetched = now;
    }

    return NextResponse.json(cachedNews);
  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
} 
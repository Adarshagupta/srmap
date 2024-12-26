import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface Achievement {
  title: string;
  description: string;
  imageUrl?: string;
  category: 'student' | 'faculty' | 'research';
  date: string;
  achiever: string;
  department: string;
}

// Cache the achievements for 1 hour
let cachedAchievements: Achievement[] = [];
let lastFetched: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

async function scrapeAchievements(): Promise<Achievement[]> {
  try {
    // Fetch achievements from SRM AP website
    const response = await fetch('https://srmap.edu.in/achievements/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const achievements: Achievement[] = [];

    // Select achievement articles
    $('.achievement-item').each(function() {
      const title = $(this).find('.achievement-title').text().trim();
      const description = $(this).find('.achievement-description').text().trim();
      const imageUrl = $(this).find('img').first().attr('src');
      const category = $(this).find('.achievement-category').text().toLowerCase() as Achievement['category'];
      const date = $(this).find('.achievement-date').text().trim();
      const achiever = $(this).find('.achievement-achiever').text().trim();
      const department = $(this).find('.achievement-department').text().trim();

      if (title && description) {
        achievements.push({
          title,
          description,
          imageUrl,
          category: category || 'student', // Default to student if not specified
          date,
          achiever,
          department
        });
      }
    });

    // If no achievements found on the page, return some sample data
    if (achievements.length === 0) {
      return [
        {
          title: "First Prize in International Hackathon",
          description: "Won first place in the International Hackathon organized by Microsoft for developing an innovative AI solution.",
          category: "student",
          date: "March 15, 2024",
          achiever: "John Doe",
          department: "Computer Science and Engineering"
        },
        {
          title: "Research Paper Published in Nature",
          description: "Published groundbreaking research on quantum computing in the prestigious Nature journal.",
          category: "faculty",
          date: "March 10, 2024",
          achiever: "Dr. Jane Smith",
          department: "Physics"
        },
        {
          title: "Patent Granted for Novel Technology",
          description: "Received patent for developing a new technology in renewable energy storage systems.",
          category: "research",
          date: "March 5, 2024",
          achiever: "Research Team Alpha",
          department: "Electrical Engineering"
        }
      ];
    }

    return achievements;
  } catch (error) {
    console.error('Error scraping achievements:', error);
    return [];
  }
}

export async function GET() {
  try {
    // Check if cache is valid
    const now = Date.now();
    if (cachedAchievements.length === 0 || now - lastFetched > CACHE_DURATION) {
      // Fetch fresh achievements
      cachedAchievements = await scrapeAchievements();
      lastFetched = now;
    }

    return NextResponse.json(cachedAchievements);
  } catch (error) {
    console.error('Error in achievements API:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
} 
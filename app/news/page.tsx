"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  date: string;
  source: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch news from your API endpoint
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Latest News</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Latest News</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item, index) => (
          <Card key={index} className="overflow-hidden flex flex-col">
            {item.imageUrl && (
              <div className="relative h-48">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{item.source}</span>
                <span>•</span>
                <span>{item.date}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                {item.title}
              </h2>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {item.description}
              </p>
              <div className="mt-auto">
                <Link href={item.link} target="_blank">
                  <Button variant="ghost" className="gap-2">
                    Read More <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 
"use client";

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Card } from './ui/card';

interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  branch: string;
  semester: number;
  year: number;
  uploadedAt: Timestamp;
}

export function RecentPapers() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentPapers() {
      try {
        const q = query(
          collection(db, 'questionPapers'),
          orderBy('uploadedAt', 'desc'),
          limit(3)
        );
        const snapshot = await getDocs(q);
        const papersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as QuestionPaper[];
        setPapers(papersData);
      } catch (error) {
        console.error('Error fetching recent papers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentPapers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No question papers available
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {papers.map((paper) => (
        <Link key={paper.id} href={`/question-papers?branch=${paper.branch}&semester=${paper.semester}`}>
          <Card className="p-4 transition-all hover:shadow-md hover:border-primary/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg shrink-0">
                <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{paper.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {paper.subject} • {paper.year}
                </p>
                <p className="text-sm text-muted-foreground">
                  {paper.branch} • Semester {paper.semester}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 
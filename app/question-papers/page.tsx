"use client";

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Download, Eye } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BRANCHES, SEMESTERS } from '@/types';
import { PDFViewer } from '@/components/pdf-viewer';

interface QuestionPaper {
  id: string;
  title: string;
  branch: string;
  semester: number;
  subject: string;
  year: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: {
    toDate: () => Date;
  };
}

const QuestionPapersPage: NextPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);

  useEffect(() => {
    const fetchPapers = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        let q = query(collection(db, 'questionPapers'), orderBy('uploadedAt', 'desc'));

        if (selectedBranch && selectedBranch !== 'all') {
          q = query(q, where('branch', '==', selectedBranch));
        }
        if (selectedSemester && selectedSemester !== 'all') {
          q = query(q, where('semester', '==', parseInt(selectedSemester)));
        }

        const snapshot = await getDocs(q);
        const papersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as QuestionPaper[];

        setPapers(papersData);
      } catch (err) {
        console.error('Error fetching papers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load question papers');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [user, selectedBranch, selectedSemester]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-4 px-2">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Access Question Papers</h2>
            <p className="text-muted-foreground">
              Sign in to view past year question papers.
            </p>
            <Link href="/auth">
              <Button className="rounded-full px-8">Sign In</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto py-4 px-2">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-destructive">Error Loading Papers</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[100rem] mx-auto py-4 px-2 space-y-4">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold">Question Papers</h1>
          <p className="text-muted-foreground">
            Access past year question papers for your branch
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {BRANCHES.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {SEMESTERS.map((semester) => (
                <SelectItem key={semester} value={semester.toString()}>
                  Semester {semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : papers.length > 0 ? (
        <div className="grid gap-2">
          {papers.map((paper) => (
            <Card key={paper.id} className="p-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{paper.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {paper.subject} • {paper.year}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {paper.branch} • Semester {paper.semester}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2 sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPaper(paper)}
                    className="flex-1 sm:flex-initial"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <a
                    href={paper.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial"
                  >
                    <Button variant="secondary" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No papers found</h3>
          <p className="text-muted-foreground">
            {selectedBranch !== 'all' || selectedSemester !== 'all'
              ? 'Try changing the filters'
              : 'Papers will appear here once uploaded'}
          </p>
        </div>
      )}

      {selectedPaper && (
        <PDFViewer
          fileUrl={selectedPaper.fileUrl}
          title={selectedPaper.title}
          open={!!selectedPaper}
          onOpenChange={(open) => !open && setSelectedPaper(null)}
        />
      )}
    </div>
  );
}

export default QuestionPapersPage; 
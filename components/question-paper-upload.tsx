"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth-provider';
import { uploadToS3, generateS3Key } from '@/lib/s3';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BRANCHES, SEMESTERS } from '@/types';
import { Loader2 } from 'lucide-react';

export function QuestionPaperUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;

    try {
      setUploading(true);

      // Upload file to S3
      const key = generateS3Key(user.uid, 'question-paper');
      const fileUrl = await uploadToS3(file, key);

      if (!fileUrl) {
        throw new Error('Failed to upload file');
      }

      // Add document to Firestore
      await addDoc(collection(db, 'questionPapers'), {
        title,
        branch,
        semester: parseInt(semester),
        subject,
        year: parseInt(year),
        fileUrl,
        uploadedBy: user.uid,
        uploadedAt: serverTimestamp(),
      });

      // Reset form
      setTitle('');
      setBranch('');
      setSemester('');
      setSubject('');
      setYear('');
      setFile(null);

      toast({
        title: 'Success',
        description: 'Question paper uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading question paper:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload question paper. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g., Data Structures Mid Semester"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <Select value={branch} onValueChange={setBranch} required>
          <SelectTrigger>
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {BRANCHES.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <Select value={semester} onValueChange={setSemester} required>
          <SelectTrigger>
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {SEMESTERS.map((s) => (
              <SelectItem key={s} value={s.toString()}>
                Semester {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          placeholder="e.g., Data Structures and Algorithms"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          min="2000"
          max={new Date().getFullYear()}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          placeholder="e.g., 2023"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Question Paper (PDF)</Label>
        <Input
          id="file"
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </div>

      <Button type="submit" disabled={uploading} className="w-full">
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Question Paper'
        )}
      </Button>
    </form>
  );
} 
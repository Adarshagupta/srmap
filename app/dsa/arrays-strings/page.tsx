'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ARRAYS_STRINGS_LESSONS } from '../courses/arrays-strings/lessons';
import { Lesson, ConceptLesson, PracticeLesson } from '../content';
import Link from 'next/link';

export default function ArraysStringsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Track Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Arrays & Strings</h1>
        <p className="text-slate-500 mb-4">
          Master fundamental data structures and string manipulation techniques
        </p>
        <div className="flex items-center gap-4">
          <Badge variant="outline">Beginner</Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Progress:</span>
            <Progress value={33} className="w-24" />
            <span className="text-sm text-slate-500">33%</span>
          </div>
        </div>
      </div>

      {/* Track Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Prerequisites</h3>
          <p className="text-slate-500 text-sm">None</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Topics Covered</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Arrays</Badge>
            <Badge variant="secondary">Strings</Badge>
            <Badge variant="secondary">Two Pointers</Badge>
            <Badge variant="secondary">Sliding Window</Badge>
            <Badge variant="secondary">Binary Search</Badge>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Resources</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>
              <a href="#" className="hover:text-blue-600">Array Data Structure Guide</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">String Manipulation Techniques</a>
            </li>
          </ul>
        </Card>
      </div>

      {/* Chapter 1: Introduction to Arrays */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction to Arrays</h2>
        <div className="grid gap-4">
          {Object.entries(ARRAYS_STRINGS_LESSONS['1'] as Record<number, Lesson>).map(([key, lesson]) => (
            <Link key={key} href={`/dsa/arrays-strings/lessons/${key}`}>
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{lesson.title}</h3>
                  {lesson.type === 'practice' && (
                    <Badge variant={
                      (lesson as PracticeLesson).difficulty === 'Easy' ? 'default' :
                      (lesson as PracticeLesson).difficulty === 'Medium' ? 'secondary' : 'destructive'
                    }>
                      {(lesson as PracticeLesson).difficulty}
                    </Badge>
                  )}
                </div>
                {lesson.type === 'concept' ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>🎓 Concept</span>
                    <span>•</span>
                    <span>{(lesson as ConceptLesson).duration}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>💻 Practice</span>
                    <span>•</span>
                    <span>{(lesson as PracticeLesson).acceptance}% Acceptance</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Code2,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  Timer,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface Chapter {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  type: 'concept' | 'practice';
  duration?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  completed?: boolean;
}

interface Track {
  title: string;
  description: string;
  chapters: Chapter[];
}

export const TRACK_CONTENT: Record<string, Track> = {
  'arrays-strings': {
    title: 'Arrays & Strings',
    description: 'Master array manipulation and string processing techniques',
    chapters: [
      {
        id: 0,
        title: 'Introduction to Arrays',
        description: 'Learn the fundamentals of array data structure',
        lessons: [
          {
            id: 0,
            title: 'Array Basics',
            type: 'concept',
            duration: '10 min',
          },
          {
            id: 1,
            title: 'Array Operations',
            type: 'practice',
            difficulty: 'Easy',
          },
          {
            id: 2,
            title: 'Array Traversal',
            type: 'practice',
            difficulty: 'Easy',
          }
        ]
      },
      {
        id: 1,
        title: 'Two Pointers Technique',
        description: 'Master the two pointers pattern for array problems',
        lessons: [
          {
            id: 0,
            title: 'Two Pointers Introduction',
            type: 'concept',
            duration: '12 min',
          },
          {
            id: 1,
            title: 'Two Sum Problem',
            type: 'practice',
            difficulty: 'Easy',
          },
          {
            id: 2,
            title: 'Three Sum Problem',
            type: 'practice',
            difficulty: 'Medium',
          },
          {
            id: 3,
            title: 'Container With Most Water',
            type: 'practice',
            difficulty: 'Medium',
          },
          {
            id: 4,
            title: 'Trapping Rain Water',
            type: 'practice',
            difficulty: 'Hard',
          }
        ]
      }
    ]
  },
  'linked-lists': {
    title: 'Linked Lists',
    description: 'Learn about linear data structures and pointer manipulation',
    chapters: [
      {
        id: 0,
        title: 'Singly Linked Lists',
        description: 'Learn about the basic linked list data structure',
        lessons: [
          {
            id: 0,
            title: 'Introduction to Linked Lists',
            type: 'concept',
            duration: '12 min',
          },
          {
            id: 1,
            title: 'Basic Operations',
            type: 'practice',
            difficulty: 'Easy',
          }
        ]
      }
    ]
  },
  'stacks-queues': {
    title: 'Stacks & Queues',
    description: 'Master fundamental abstract data types and their implementations',
    chapters: [
      {
        id: 0,
        title: 'Stack Fundamentals',
        description: 'Learn about the stack data structure and its operations',
        lessons: [
          {
            id: 0,
            title: 'Introduction to Stacks',
            type: 'concept',
            duration: '10 min',
          },
          {
            id: 1,
            title: 'Stack Implementation',
            type: 'practice',
            difficulty: 'Easy',
          }
        ]
      }
    ]
  },
  'trees-graphs': {
    title: 'Trees & Graphs',
    description: 'Learn hierarchical and network-based data structures',
    chapters: [
      {
        id: 0,
        title: 'Binary Trees',
        description: 'Learn about tree data structures and traversal algorithms',
        lessons: [
          {
            id: 0,
            title: 'Tree Basics',
            type: 'concept',
            duration: '15 min',
          },
          {
            id: 1,
            title: 'Tree Traversal',
            type: 'practice',
            difficulty: 'Easy',
          }
        ]
      }
    ]
  },
  'dynamic-programming': {
    title: 'Dynamic Programming',
    description: 'Master the art of solving complex problems through optimization',
    chapters: [
      {
        id: 0,
        title: 'Introduction to DP',
        description: 'Learn the fundamentals of dynamic programming',
        lessons: [
          {
            id: 0,
            title: 'DP Basics',
            type: 'concept',
            duration: '15 min',
          },
          {
            id: 1,
            title: 'Fibonacci Numbers',
            type: 'practice',
            difficulty: 'Easy',
          }
        ]
      }
    ]
  },
  'advanced-algorithms': {
    title: 'Advanced Algorithms',
    description: 'Learn sophisticated algorithmic techniques and problem-solving strategies',
    chapters: [
      {
        id: 0,
        title: 'Divide & Conquer',
        description: 'Master the divide and conquer strategy',
        lessons: [
          {
            id: 0,
            title: 'Introduction to D&C',
            type: 'concept',
            duration: '15 min',
          },
          {
            id: 1,
            title: 'Merge Sort',
            type: 'practice',
            difficulty: 'Medium',
          }
        ]
      }
    ]
  }
};

export default function TrackPage({ params }: { params: { slug: string } }) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const track = TRACK_CONTENT[params.slug];

  if (!track) {
    return <div>Track not found</div>;
  }

  const totalLessons = track.chapters.reduce(
    (sum, chapter) => sum + chapter.lessons.length,
    0
  );
  const completedLessons = track.chapters.reduce(
    (sum, chapter) => sum + chapter.lessons.filter(l => l.completed).length,
    0
  );
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="max-w-[100rem] mx-auto py-4 px-2 space-y-6">
      {/* Track Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{track.title}</h1>
        <p className="text-lg text-muted-foreground">{track.description}</p>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {totalLessons} lessons • {track.chapters.length} chapters
          </div>
          <Progress value={progress} className="w-40" />
          <div className="text-sm font-medium">{progress}% complete</div>
        </div>
      </div>

      {/* Track Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Master array manipulation techniques</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Understand time and space complexity</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Solve common coding interview problems</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Implement efficient algorithms</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Course Structure</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium">Concept Lectures</div>
                  <div className="text-sm text-muted-foreground">
                    Learn core concepts through interactive lessons
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Code2 className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="font-medium">Practice Problems</div>
                  <div className="text-sm text-muted-foreground">
                    Apply concepts through coding challenges
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <PlayCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium">Interactive Compiler</div>
                  <div className="text-sm text-muted-foreground">
                    Write and test code in multiple languages
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {track.chapters.map((chapter) => (
            <Card key={chapter.id} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Chapter {chapter.id + 1}: {chapter.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {chapter.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {chapter.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/dsa/lesson/${params.slug}/${chapter.id}/${lesson.id}`}
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {lesson.type === 'concept' ? (
                            <BookOpen className="w-5 h-5 text-blue-500" />
                          ) : (
                            <Code2 className="w-5 h-5 text-purple-500" />
                          )}
                          <div>
                            <div className="font-medium">{lesson.title}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {lesson.type === 'concept' ? (
                                <>
                                  <Timer className="w-4 h-4" />
                                  {lesson.duration}
                                </>
                              ) : (
                                <Badge variant={
                                  lesson.difficulty === 'Easy' ? 'default' :
                                  lesson.difficulty === 'Medium' ? 'secondary' : 'destructive'
                                }>
                                  {lesson.difficulty}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {lesson.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Recommended Reading</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>• Introduction to Algorithms (CLRS)</li>
                  <li>• Data Structures and Algorithms in Python</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">Practice Platforms</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>• LeetCode</li>
                  <li>• HackerRank</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
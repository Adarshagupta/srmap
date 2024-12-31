"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GraduationCap,
  Brain,
  Rocket,
  Trophy,
  ArrowRight,
  Code2,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Network,
  GitBranch,
  Infinity,
  TreePine,
  Binary,
  Hash,
  Boxes,
  Combine,
  Workflow,
  Building2,
  LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { ARRAYS_STRINGS_LESSONS } from './courses/arrays-strings/lessons';
import { LINKED_LISTS_LESSONS } from './courses/linked-lists/lessons';
import { STACKS_QUEUES_LESSONS } from './courses/stacks-queues/lessons';
import { TREES_GRAPHS_LESSONS } from './courses/trees-graphs/lessons';
import { DYNAMIC_PROGRAMMING_LESSONS } from './courses/dynamic-programming/lessons';
import { ADVANCED_ALGORITHMS_LESSONS } from './courses/advanced-algorithms/lessons';

interface DifficultyLevel {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    name: 'Beginner',
    description: 'Perfect for those starting their DSA journey',
    icon: BookOpen,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    name: 'Intermediate',
    description: 'For those comfortable with basic programming concepts',
    icon: Brain,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    name: 'Advanced',
    description: 'Complex problems requiring strong problem-solving skills',
    icon: Rocket,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    name: 'Expert',
    description: 'Challenging problems seen in top tech interviews',
    icon: Trophy,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
];

interface Resource {
  type: 'video' | 'article';
  url: string;
  title: string;
}

interface TrackInfo {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  prerequisites: string[];
  topics: string[];
  problemCount: number;
  resources: Resource[];
}

const TRACKS: TrackInfo[] = [
  {
    slug: 'arrays-strings',
    title: 'Arrays & Strings',
    description: 'Master fundamental data structures and string manipulation techniques.',
    icon: '📊',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    progress: 0,
    difficulty: 'Beginner',
    prerequisites: [],
    topics: ['Arrays', 'Strings', 'Two Pointers', 'Sliding Window', 'Binary Search'],
    problemCount: Object.values(ARRAYS_STRINGS_LESSONS).reduce((count, chapter) => count + Object.keys(chapter).length, 0),
    resources: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=B-nEXqmDB8k', title: 'Array Methods Tutorial' },
      { type: 'article', url: 'https://www.geeksforgeeks.org/array-data-structure/', title: 'Array Data Structure' }
    ]
  },
  {
    slug: 'linked-lists',
    title: 'Linked Lists',
    description: 'Learn about linked lists and their applications in solving complex problems.',
    icon: '🔗',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    progress: 0,
    difficulty: 'Intermediate',
    prerequisites: ['Arrays & Strings'],
    topics: ['Singly Linked Lists', 'Doubly Linked Lists', 'Fast & Slow Pointers'],
    problemCount: Object.values(LINKED_LISTS_LESSONS).reduce((count, chapter) => count + Object.keys(chapter).length, 0),
    resources: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=N3cWQnBeMog', title: 'Linked List Basics' },
      { type: 'article', url: 'https://www.geeksforgeeks.org/linked-list-set-1-introduction/', title: 'Introduction to Linked Lists' }
    ]
  },
  {
    slug: 'stacks-queues',
    title: 'Stacks & Queues',
    description: 'Understand stack and queue data structures and their real-world applications.',
    icon: '📚',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    progress: 0,
    difficulty: 'Intermediate',
    prerequisites: ['Arrays & Strings', 'Linked Lists'],
    topics: ['Stacks', 'Queues', 'Monotonic Stack', 'Priority Queue'],
    problemCount: Object.values(STACKS_QUEUES_LESSONS).reduce((count, chapter) => count + Object.keys(chapter).length, 0),
    resources: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=F1F2imiOJfk', title: 'Stack Data Structure' },
      { type: 'article', url: 'https://www.geeksforgeeks.org/stack-data-structure/', title: 'Stack Implementation' }
    ]
  },
  {
    slug: 'trees-graphs',
    title: 'Trees & Graphs',
    description: 'Master hierarchical and network-based data structures.',
    icon: '🌳',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    progress: 0,
    difficulty: 'Advanced',
    prerequisites: ['Stacks & Queues'],
    topics: ['Binary Trees', 'BST', 'Graph Traversal', 'Shortest Path'],
    problemCount: Object.values(TREES_GRAPHS_LESSONS).reduce((count, chapter) => count + Object.keys(chapter).length, 0),
    resources: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=oSWTXtMglKE', title: 'Tree Data Structure' },
      { type: 'article', url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/', title: 'Binary Tree Basics' }
    ]
  },
  {
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    description: 'Learn to solve complex problems by breaking them down into simpler subproblems.',
    icon: '🧮',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    progress: 0,
    difficulty: 'Advanced',
    prerequisites: ['Arrays & Strings', 'Recursion'],
    topics: ['Memoization', 'Tabulation', 'State Machines', 'Optimization'],
    problemCount: Object.values(DYNAMIC_PROGRAMMING_LESSONS).reduce((count, chapter) => count + Object.keys(chapter).length, 0),
    resources: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=vYquumk4nWw', title: 'Dynamic Programming Introduction' },
      { type: 'article', url: 'https://www.geeksforgeeks.org/dynamic-programming/', title: 'DP Concepts' }
    ]
  },
  {
    slug: 'advanced-algorithms',
    title: 'Advanced Algorithms',
    description: 'Master advanced algorithmic techniques and problem-solving strategies.',
    icon: '🎯',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
    progress: 0,
    difficulty: 'Expert',
    prerequisites: ['Dynamic Programming', 'Trees & Graphs'],
    topics: ['Divide & Conquer', 'Greedy Algorithms', 'Backtracking'],
    problemCount: Object.values(ADVANCED_ALGORITHMS_LESSONS).reduce((count, chapter) => count + Object.keys(chapter).length, 0),
    resources: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=2Rr2tW9zvRg', title: 'Advanced Algorithm Techniques' },
      { type: 'article', url: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/', title: 'Algorithm Fundamentals' }
    ]
  }
];

interface TrackCardProps {
  track: TrackInfo;
}

function TrackCard({ track }: TrackCardProps) {
  return (
    <div>
      <Link href={`/dsa/${track.slug}`}>
        <div className={`${track.bgColor} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">{track.icon}</span>
            <h3 className={`${track.color} text-xl font-semibold`}>{track.title}</h3>
          </div>
          <p className="text-gray-600 mb-4">{track.description}</p>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{track.problemCount} problems</span>
            <span className="text-sm font-medium">{track.difficulty}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${track.color.replace('text', 'bg')} rounded-full h-2`}
              style={{ width: `${track.progress}%` }}
            ></div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function DSAPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  const filteredTracks = selectedDifficulty
    ? TRACKS.filter((track: TrackInfo) => track.difficulty === selectedDifficulty)
    : TRACKS;

  const totalProblems = TRACKS.reduce((sum: number, track: TrackInfo) => sum + track.problemCount, 0);
  const totalProgress = Math.round(
    TRACKS.reduce((sum: number, track: TrackInfo) => sum + track.progress * track.problemCount, 0) / totalProblems
  );

  return (
    <div className="max-w-[100rem] mx-auto py-4 px-2 space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-purple-600 p-8 md:p-12 rounded-3xl">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Master Data Structures & Algorithms
            </h1>
            <p className="text-lg text-white/90">
              A comprehensive course to help you excel in DSA. From basic concepts to expert-level problems.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white">
                <span className="font-bold">{totalProblems}</span> Problems
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white">
                <span className="font-bold">{TRACKS.length}</span> Tracks
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white">
                <span className="font-bold">{DIFFICULTY_LEVELS.length}</span> Difficulty Levels
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Link href="/dsa/companies">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Problems
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Levels */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Learning Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIFFICULTY_LEVELS.map((level: DifficultyLevel) => (
            <Card
              key={level.name}
              className={`p-6 cursor-pointer transition-all ${
                selectedDifficulty === level.name
                  ? 'ring-2 ring-primary'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedDifficulty(
                selectedDifficulty === level.name ? null : level.name
              )}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 ${level.bgColor} rounded-lg flex items-center justify-center`}>
                  <level.icon className={`w-6 h-6 ${level.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{level.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {level.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Course Tracks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Course Tracks</h2>
          {selectedDifficulty && (
            <Button variant="outline" onClick={() => setSelectedDifficulty(null)}>
              Clear Filter
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTracks.map((track: TrackInfo) => (
            <TrackCard key={track.slug} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
} 
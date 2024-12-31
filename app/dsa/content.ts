import { LucideIcon, Code2, GitBranch, Boxes, TreePine, Combine, Lightbulb } from 'lucide-react';
import { ARRAYS_STRINGS_TRACK } from './courses/arrays-strings';
import { ARRAYS_STRINGS_LESSONS } from './courses/arrays-strings/lessons';

export interface Example {
  input: string;
  output: string;
  explanation: string;
}

export interface TestCase {
  input: string[];
  output: string[];
}

export interface StarterCode {
  python: string;
  cpp: string;
  java: string;
}

export interface ConceptLesson {
  type: 'concept';
  title: string;
  duration: string;
  content: string;
  examples: Example[];
}

export interface Company {
  name: string;
  logo: string;
  problemCount: number;
}

export interface Frequency {
  company: string;
  frequency: 'Low' | 'Medium' | 'High';
  lastAsked?: string;
}

export interface PracticeLesson {
  id: string;
  type: 'practice';
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  content?: string;
  examples: Example[];
  starterCode: StarterCode;
  testCases: TestCase[];
  hints: string[];
  solution: string;
  timeComplexity: string;
  spaceComplexity: string;
  companies?: Frequency[];
  acceptance?: number;
  submissions?: number;
  topics?: string[];
  similarProblems?: string[];
}

export type Lesson = ConceptLesson | PracticeLesson;

export type ChapterContent = Record<number, Lesson>;

export interface Resource {
  type: 'video' | 'article';
  url: string;
  title: string;
}

export interface TrackInfo {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  prerequisites: string[];
  topics: string[];
  problemCount: number;
  resources: Resource[];
}

export type LessonContent = Record<string, Record<number, ChapterContent>>;

// Company data
export const COMPANIES: Company[] = [
  {
    name: 'Google',
    logo: '/companies/google.svg',
    problemCount: 847
  },
  {
    name: 'Amazon',
    logo: '/companies/amazon.svg',
    problemCount: 756
  },
  {
    name: 'Microsoft',
    logo: '/companies/microsoft.svg',
    problemCount: 678
  },
  {
    name: 'Meta',
    logo: '/companies/meta.svg',
    problemCount: 589
  },
  {
    name: 'Apple',
    logo: '/companies/apple.svg',
    problemCount: 432
  },
  {
    name: 'Bloomberg',
    logo: '/companies/bloomberg.svg',
    problemCount: 378
  },
  {
    name: 'Adobe',
    logo: '/companies/adobe.svg',
    problemCount: 245
  },
  {
    name: 'Uber',
    logo: '/companies/uber.svg',
    problemCount: 234
  }
];

// Export the content
export const LESSON_CONTENT: LessonContent = {
  'arrays-strings': ARRAYS_STRINGS_LESSONS,
  // ... other tracks will be added similarly
};

export const TRACKS: TrackInfo[] = [
  ARRAYS_STRINGS_TRACK,
  {
    slug: 'linked-lists',
    title: 'Linked Lists',
    description: 'Learn about singly and doubly linked lists',
    icon: GitBranch,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    progress: 0,
    difficulty: 'Beginner',
    prerequisites: ['Arrays & Strings'],
    topics: ['Linked Lists', 'Two Pointers', 'Fast & Slow Pointers'],
    problemCount: 8,
    resources: [
      { type: 'article', title: 'Linked Lists Basics', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/' }
    ]
  },
  // ... keep other tracks ...
]; 
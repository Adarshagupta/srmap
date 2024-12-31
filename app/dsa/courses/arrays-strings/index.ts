import { TrackInfo } from '@/app/dsa/content';
import { Code2 } from 'lucide-react';

export const ARRAYS_STRINGS_TRACK: TrackInfo = {
  slug: 'arrays-strings',
  title: 'Arrays & Strings',
  description: 'Master fundamental data structures and algorithms for arrays and strings',
  icon: Code2,
  color: 'text-blue-500',
  bgColor: 'bg-blue-500/10',
  progress: 0,
  difficulty: 'Beginner',
  prerequisites: [],
  topics: [
    'Array Manipulation',
    'Two Pointers',
    'Sliding Window',
    'Binary Search',
    'String Manipulation'
  ],
  problemCount: 10,
  resources: [
    {
      type: 'article',
      title: 'Arrays in Data Structures',
      url: 'https://www.geeksforgeeks.org/array-data-structure/'
    },
    {
      type: 'video',
      title: 'Arrays & Strings Crash Course',
      url: 'https://www.youtube.com/watch?v=B2KusJcwi-k'
    }
  ]
}; 
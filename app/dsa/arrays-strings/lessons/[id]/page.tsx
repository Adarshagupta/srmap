import Link from 'next/link';
import { ARRAYS_STRINGS_LESSONS } from '../../../courses/arrays-strings/lessons';
import { notFound } from 'next/navigation';

interface Lesson {
  type: 'concept' | 'practice';
  title: string;
  duration?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  content?: string;
  description?: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  starterCode?: {
    python: string;
    cpp: string;
    java: string;
  };
  solution?: string;
  testCases?: Array<{
    input: string[];
    output: any[];
  }>;
  hints?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function LessonPage({ params }: PageProps) {
  // Find the lesson in the course content
  let lesson: Lesson | undefined;
  let chapterIndex = -1;
  let lessonIndex = -1;

  // Search through chapters to find the lesson
  Object.entries(ARRAYS_STRINGS_LESSONS).some(([chapter, lessons], chapIdx) => {
    const found = Object.entries(lessons as Record<number, Lesson>).some(([key, l], lesIdx) => {
      if (key === params.id) {
        lesson = l;
        chapterIndex = chapIdx;
        lessonIndex = lesIdx;
        return true;
      }
      return false;
    });
    return found;
  });

  if (!lesson) {
    notFound();
  }

  // Get next and previous lesson IDs
  const allLessons = Object.entries(ARRAYS_STRINGS_LESSONS).flatMap(([chapter, lessons]) =>
    Object.entries(lessons as Record<number, Lesson>).map(([key, lesson]) => ({
      id: key,
      ...lesson
    }))
  );
  
  const currentIndex = allLessons.findIndex(l => l.id === params.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/dsa" className="hover:text-gray-800">DSA</Link>
        <span>/</span>
        <Link href="/dsa/arrays-strings" className="hover:text-gray-800">Arrays & Strings</Link>
        <span>/</span>
        <span className="text-gray-800">{lesson.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
        <div className="flex items-center gap-4">
          {lesson.duration && (
            <span className="text-gray-500">
              <span className="font-medium">Duration:</span> {lesson.duration}
            </span>
          )}
          {lesson.type === 'practice' && lesson.difficulty && (
            <span className={`px-2 py-1 rounded text-sm ${
              lesson.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              lesson.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {lesson.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="prose max-w-none mb-8">
        {lesson.type === 'concept' ? (
          // Concept Lesson
          <div dangerouslySetInnerHTML={{ __html: lesson.content || '' }} />
        ) : (
          // Practice Problem
          <div>
            <h2>Problem Description</h2>
            <p>{lesson.description}</p>

            {lesson.examples && lesson.examples.length > 0 && (
              <div className="mt-6">
                <h3>Examples</h3>
                <div className="space-y-4">
                  {lesson.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p><strong>Input:</strong> {example.input}</p>
                      <p><strong>Output:</strong> {example.output}</p>
                      <p><strong>Explanation:</strong> {example.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.starterCode && (
              <div className="mt-6">
                <h3>Starter Code</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                  <pre><code>{lesson.starterCode.python}</code></pre>
                </div>
              </div>
            )}

            {lesson.hints && lesson.hints.length > 0 && (
              <div className="mt-6">
                <h3>Hints</h3>
                <ul>
                  {lesson.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t">
        {prevLesson ? (
          <Link href={`/dsa/arrays-strings/lessons/${prevLesson.id}`} className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
            <span>←</span>
            <span>Previous: {prevLesson.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link href={`/dsa/arrays-strings/lessons/${nextLesson.id}`} className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
            <span>Next: {nextLesson.title}</span>
            <span>→</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
} 
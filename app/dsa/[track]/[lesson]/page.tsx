import React from 'react';
import { LessonContent } from '../../../../components/lesson/LessonContent';
import { CodeEditor } from '../../../../components/lesson/CodeEditor';
import { ARRAYS_STRINGS_LESSONS } from '../../courses/arrays-strings/lessons';
import { LESSON_CONTENT, Example, ConceptLesson, PracticeLesson } from '../../content';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LessonPageProps {
  params: {
    track: string;
    lesson: string;
  };
}

type Lesson = ConceptLesson | PracticeLesson;

export default function LessonPage({ params }: LessonPageProps) {
  // First try to get the lesson from the track-specific content
  let lesson: Lesson | undefined;
  if (params.track === 'arrays-strings') {
    // Search through chapters to find the lesson
    Object.entries(ARRAYS_STRINGS_LESSONS).some(([chapter, lessons]) => {
      return Object.entries(lessons).some(([key, l]) => {
        if (key === params.lesson) {
          lesson = l as unknown as Lesson;
          return true;
        }
        return false;
      });
    });
  } else {
    // Try to get from general lesson content
    const lessonId = `${params.track}/${params.lesson}`;
    lesson = LESSON_CONTENT[lessonId] as unknown as Lesson;
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Lesson Not Found</h1>
          <p className="text-slate-500 mb-4">The requested lesson does not exist.</p>
          <Button asChild>
            <Link href="/dsa">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {lesson.type === 'concept' && (
              <span>Duration: {lesson.duration}</span>
            )}
            {lesson.type === 'practice' && (
              <span>Difficulty: {lesson.difficulty}</span>
            )}
          </div>
        </div>

        {lesson.type === 'concept' ? (
          <LessonContent content={lesson.content} />
        ) : (
          <div className="space-y-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Problem</h2>
              <p>{lesson.description}</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Examples</h3>
              {lesson.examples?.map((example: Example, index: number) => (
                <div key={index} className="mb-4">
                  <p>
                    <strong>Input:</strong> {example.input}
                  </p>
                  <p>
                    <strong>Output:</strong> {example.output}
                  </p>
                  {example.explanation && (
                    <p>
                      <strong>Explanation:</strong> {example.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Solution</h2>
              <CodeEditor
                starterCode={lesson.starterCode}
                testCases={lesson.testCases}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
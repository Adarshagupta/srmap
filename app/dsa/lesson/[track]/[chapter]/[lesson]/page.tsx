"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeEditor } from '@/components/code-editor';
import {
  ChevronLeft,
  ChevronRight,
  Timer,
  PlayCircle,
  FileText,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { LESSON_CONTENT as GLOBAL_LESSON_CONTENT, PracticeLesson } from '@/app/dsa/content';

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface TestCase {
  input: string[];
  output: (number | boolean | number[] | number[][] | string)[];
}

interface Lesson {
  type: 'concept' | 'practice';
  title: string;
  duration?: string;
  content?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  examples?: Example[];
  starterCode?: {
    python: string;
    cpp: string;
    java: string;
  };
  testCases?: TestCase[];
  hints?: string[];
  solution?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface ChapterContent {
  [key: number]: Lesson;
}

interface TrackContent {
  [key: number]: ChapterContent;
}

interface LessonContent {
  [key: string]: TrackContent;
}

interface TrackLesson {
  id: number;
  title: string;
  type: 'concept' | 'practice';
  duration?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  completed?: boolean;
}

interface TrackChapter {
  id: number;
  title: string;
  description: string;
  lessons: TrackLesson[];
}

interface Track {
  title: string;
  description: string;
  chapters: TrackChapter[];
}

const LESSON_CONTENT: LessonContent = {
  'arrays-strings': {
    0: { // Introduction to Arrays
      0: { // Array Basics
        type: 'concept',
        title: 'Array Basics',
        duration: '10 min',
        content: `
# Introduction to Arrays

Arrays are one of the most fundamental data structures in computer science. They are used to store collections of elements in a contiguous block of memory.

## What is an Array?

An array is a collection of similar data elements stored at contiguous memory locations. It is the simplest data structure where each data element can be accessed directly by using its index number.

## Key Characteristics

1. **Fixed Size** (in most languages)
   - Arrays typically have a fixed size once declared
   - Some languages like Python use dynamic arrays (lists) that can grow

2. **Constant-time Access**
   - Elements can be accessed in O(1) time using index
   - Direct memory access using base address + index

3. **Contiguous Memory**
   - Elements are stored in consecutive memory locations
   - Provides memory locality and cache efficiency

4. **Zero-based Indexing**
   - Most programming languages start array indices at 0
   - Last element is at index (length - 1)

## Array Declaration

Different programming languages have different syntax for declaring arrays:

\`\`\`python
# Python
numbers = [1, 2, 3, 4, 5]
fruits = ["apple", "banana", "orange"]

# Empty array
empty_array = []

# Array of size 5 with all zeros
sized_array = [0] * 5
\`\`\`

\`\`\`java
// Java
int[] numbers = {1, 2, 3, 4, 5};
String[] fruits = {"apple", "banana", "orange"};

// Empty array
int[] emptyArray = new int[0];

// Array of size 5 with all zeros
int[] sizedArray = new int[5];
\`\`\`

\`\`\`cpp
// C++
int numbers[] = {1, 2, 3, 4, 5};
string fruits[] = {"apple", "banana", "orange"};

// Empty array
vector<int> emptyArray;

// Array of size 5 with all zeros
int sizedArray[5] = {0};
\`\`\`

## Common Operations

### 1. Accessing Elements - O(1)
\`\`\`python
numbers = [1, 2, 3, 4, 5]

first_element = numbers[0]     # 1
third_element = numbers[2]     # 3
last_element = numbers[-1]     # 5 (Python specific)
\`\`\`

### 2. Modifying Elements - O(1)
\`\`\`python
numbers[0] = 10    # Change first element to 10
numbers[-1] = 50   # Change last element to 50
\`\`\`

### 3. Finding Length - O(1)
\`\`\`python
length = len(numbers)    # Returns 5
\`\`\`

### 4. Iterating Through Array - O(n)
\`\`\`python
# Method 1: Using index
for i in range(len(numbers)):
    print(numbers[i])

# Method 2: Direct iteration (Python)
for num in numbers:
    print(num)
\`\`\`

## Best Practices

1. **Use arrays when:**
   - You need constant-time access to elements
   - The size is fixed
   - Memory locality is important
   - You need cache efficiency

2. **Consider alternatives when:**
   - Size needs to be dynamic (use dynamic arrays/lists)
   - You need frequent insertions/deletions (use linked lists)
   - Memory is a constraint (use sparse arrays)

## Common Pitfalls

1. **Index Out of Bounds**
   - Accessing an index < 0 or ≥ length
   - Not checking array bounds before access

2. **Off-by-One Errors**
   - Forgetting that arrays are zero-indexed
   - Incorrect loop conditions (using <= instead of <)

3. **Performance Issues**
   - Not considering time complexity of operations
   - Inefficient array traversal patterns

4. **Memory Issues**
   - Creating unnecessarily large arrays
   - Not releasing memory when done (in languages without GC)

## Practice Exercises

1. Create arrays of different types (integers, strings, etc.)
2. Access elements using positive and negative indices
3. Modify array elements and observe changes
4. Implement array traversal using different methods
5. Handle array bounds checking properly

## Time Complexity

| Operation | Time Complexity |
|-----------|----------------|
| Access    | O(1)          |
| Search    | O(n)          |
| Insert    | O(n)          |
| Delete    | O(n)          |

## Additional Resources

1. [Python Lists Documentation](https://docs.python.org/3/tutorial/datastructures.html)
2. [Java Arrays Documentation](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html)
3. [C++ Arrays Reference](https://en.cppreference.com/w/cpp/container/array)
`,
        examples: [
          {
            input: 'numbers = [1, 2, 3, 4, 5]',
            output: 'first_element = numbers[0]  # Returns 1',
            explanation: 'Accessing the first element of the array using index 0'
          },
          {
            input: 'fruits = ["apple", "banana", "orange"]',
            output: 'fruits[1] = "grape"  # Changes second element',
            explanation: 'Modifying an array element at index 1'
          }
        ],
        hints: [
          'Remember that array indices start at 0',
          'Always check array bounds before accessing elements',
          'Consider the time complexity of each operation',
          'Use appropriate array methods for your language'
        ]
      },
      1: { // Array Operations
        type: 'practice',
        title: 'Array Operations',
        difficulty: 'Easy',
        description: `Write a function that performs basic array operations. Your function should:

1. Create an array of size n filled with zeros
2. Set the first element to 1 and last element to n
3. Return the modified array

For example:
- Input: n = 5
- Output: [1, 0, 0, 0, 5]`,
        examples: [
          {
            input: 'n = 5',
            output: '[1, 0, 0, 0, 5]',
            explanation: 'Created array of size 5, set first element to 1 and last to 5'
          },
          {
            input: 'n = 3',
            output: '[1, 0, 3]',
            explanation: 'Created array of size 3, set first element to 1 and last to 3'
          }
        ],
        starterCode: {
          python: `def initialize_array(n: int) -> list:
    # Your code here
    pass`,
          cpp: `vector<int> initializeArray(int n) {
    // Your code here
}`,
          java: `public int[] initializeArray(int n) {
    // Your code here
}`
        },
        testCases: [
          {
            input: ['5'],
            output: [[1, 0, 0, 0, 5]]
          },
          {
            input: ['3'],
            output: [[1, 0, 3]]
          },
          {
            input: ['1'],
            output: [[1]]
          }
        ],
        hints: [
          'Use array creation syntax specific to your language',
          'Remember that array indices start at 0',
          'Last index is size - 1'
        ],
        solution: `def initialize_array(n: int) -> list:
    # Create array of zeros
    arr = [0] * n
    
    # Set first and last elements
    if n > 0:
        arr[0] = 1
        arr[-1] = n
    
    return arr`,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      }
    }
  },
  'linked-lists': {
    0: { // Singly Linked Lists
      0: { // Introduction to Linked Lists
        type: 'concept',
        title: 'Introduction to Linked Lists',
        duration: '12 min',
        content: `# Introduction to Linked Lists

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence.

## Basic Structure

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
\`\`\`

## Key Characteristics

1. Dynamic size
2. Non-contiguous memory
3. Linear traversal
4. Efficient insertion/deletion`
      },
      1: { // Basic Operations
        type: 'practice',
        title: 'Basic Operations',
        difficulty: 'Easy',
        description: 'Implement basic linked list operations: insertion at beginning, end, and deletion.',
        starterCode: {
          python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert_at_beginning(self, data):
        # Your code here
        pass
    
    def insert_at_end(self, data):
        # Your code here
        pass
    
    def delete_node(self, key):
        # Your code here
        pass`,
          cpp: `// Your C++ code here`,
          java: `// Your Java code here`
        }
      }
    }
  },
  'stacks-queues': {
    0: { // Stack Fundamentals
      0: { // Introduction to Stacks
        type: 'concept',
        title: 'Introduction to Stacks',
        duration: '10 min',
        content: `# Introduction to Stacks

A stack is a linear data structure that follows the Last In First Out (LIFO) principle.

## Basic Operations

1. Push: Add element to top
2. Pop: Remove element from top
3. Peek: View top element
4. IsEmpty: Check if stack is empty`
      },
      1: { // Stack Implementation
        type: 'practice',
        title: 'Stack Implementation',
        difficulty: 'Easy',
        description: 'Implement a stack with push, pop, and peek operations.',
        starterCode: {
          python: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        # Your code here
        pass
    
    def pop(self):
        # Your code here
        pass
    
    def peek(self):
        # Your code here
        pass`,
          cpp: `// Your C++ code here`,
          java: `// Your Java code here`
        }
      }
    }
  },
  'trees-graphs': {
    0: { // Binary Trees
      0: { // Tree Basics
        type: 'concept',
        title: 'Tree Basics',
        duration: '15 min',
        content: `# Introduction to Trees

A tree is a hierarchical data structure with a root node and child nodes.

## Basic Structure

\`\`\`python
class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
\`\`\`

## Types of Trees

1. Binary Trees
2. Binary Search Trees
3. AVL Trees
4. Red-Black Trees`
      },
      1: { // Tree Traversal
        type: 'practice',
        title: 'Tree Traversal',
        difficulty: 'Easy',
        description: 'Implement inorder, preorder, and postorder traversal for a binary tree.',
        starterCode: {
          python: `class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

def inorder_traversal(root):
    # Your code here
    pass

def preorder_traversal(root):
    # Your code here
    pass

def postorder_traversal(root):
    # Your code here
    pass`,
          cpp: `// Your C++ code here`,
          java: `// Your Java code here`
        }
      }
    }
  },
  'dynamic-programming': {
    0: { // Introduction to DP
      0: { // DP Basics
        type: 'concept',
        title: 'DP Basics',
        duration: '15 min',
        content: `# Introduction to Dynamic Programming

Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems.

## Key Concepts

1. Optimal Substructure
2. Overlapping Subproblems
3. Memoization
4. Tabulation`
      },
      1: { // Fibonacci Numbers
        type: 'practice',
        title: 'Fibonacci Numbers',
        difficulty: 'Easy',
        description: 'Implement fibonacci number calculation using dynamic programming.',
        starterCode: {
          python: `def fibonacci(n):
    # Your code here
    pass`,
          cpp: `// Your C++ code here`,
          java: `// Your Java code here`
        }
      }
    }
  },
  'advanced-algorithms': {
    0: { // Divide & Conquer
      0: { // Introduction to D&C
        type: 'concept',
        title: 'Introduction to D&C',
        duration: '15 min',
        content: `# Introduction to Divide & Conquer

Divide and Conquer is a problem-solving strategy that breaks down a problem into smaller subproblems.

## Steps

1. Divide: Break into smaller subproblems
2. Conquer: Recursively solve subproblems
3. Combine: Merge solutions`
      },
      1: { // Merge Sort
        type: 'practice',
        title: 'Merge Sort',
        difficulty: 'Medium',
        description: 'Implement the merge sort algorithm using divide and conquer strategy.',
        starterCode: {
          python: `def merge_sort(arr):
    # Your code here
    pass

def merge(left, right):
    # Your code here
    pass`,
          cpp: `// Your C++ code here`,
          java: `// Your Java code here`
        }
      }
    }
  }
};

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'python' | 'cpp' | 'java';
}

export default function LessonPage({ params }: { params: { track: string; chapter: string; lesson: string } }) {
  const [selectedTab, setSelectedTab] = useState('problem');
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp' | 'java'>('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const lesson = GLOBAL_LESSON_CONTENT[params.track]?.[parseInt(params.chapter)]?.[parseInt(params.lesson)];
  const trackContent = GLOBAL_LESSON_CONTENT[params.track];
  const currentChapterContent = trackContent?.[parseInt(params.chapter)];
  const nextChapterContent = trackContent?.[parseInt(params.chapter) + 1];

  if (!trackContent || !lesson || !currentChapterContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <Button asChild>
            <Link href="/dsa">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isPracticeLesson = lesson.type === 'practice';
  const practiceLesson = isPracticeLesson ? lesson as PracticeLesson : null;

  // Get next lesson
  let nextLesson: { track: string; chapter: string; lesson: string } | null = null;
  const currentLessonNumber = parseInt(params.lesson);
  const nextLessonInChapter = currentChapterContent[currentLessonNumber + 1];

  if (nextLessonInChapter) {
    nextLesson = {
      track: params.track,
      chapter: params.chapter,
      lesson: (currentLessonNumber + 1).toString()
    };
  } else {
    // Look for the first lesson in subsequent chapters
    let nextChapterIndex = parseInt(params.chapter) + 1;
    while (trackContent[nextChapterIndex]) {
      const nextChapterContent = trackContent[nextChapterIndex];
      // Find the first lesson in this chapter
      const firstLessonEntry = Object.entries(nextChapterContent)[0];
      if (firstLessonEntry) {
        nextLesson = {
          track: params.track,
          chapter: nextChapterIndex.toString(),
          lesson: firstLessonEntry[0]
        };
        break;
      }
      nextChapterIndex++;
    }
  }

  const handleRunCode = (code: string) => {
    runCode();
  };

  const runCode = async () => {
    setIsRunning(true);
    try {
      // Here we'll integrate with a code execution service
      // For now, just simulate running tests
      const testResults = practiceLesson?.testCases?.map((test: TestCase) => {
        try {
          // In reality, we'd send the code to a backend service
          // that would safely execute it with the test inputs
          return {
            input: test.input.join(', '),
            expected: test.output[0],
            actual: 'Not implemented',
            passed: false
          };
        } catch (err) {
          const error = err as Error;
          return {
            input: test.input.join(', '),
            expected: test.output[0],
            actual: error.message,
            passed: false
          };
        }
      });

      setOutput(JSON.stringify(testResults, null, 2));
    } catch (err) {
      const error = err as Error;
      setOutput(error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'python' | 'cpp' | 'java';
    setSelectedLanguage(value);
  };

  return (
    <div className="max-w-[100rem] mx-auto py-4 px-2 space-y-6">
      {/* Lesson Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          {lesson.type === 'concept' ? (
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              <span>{lesson.duration}</span>
            </div>
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

      {/* Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="hints">Hints</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
            </TabsList>

            <TabsContent value="problem" className="space-y-4">
              <Card className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  {lesson.type === 'concept' ? (
                    <div dangerouslySetInnerHTML={{ __html: lesson.content || '' }} />
                  ) : (
                    <>
                      <h2>Problem Description</h2>
                      <p>{lesson.description}</p>

                      <h3>Examples</h3>
                      {lesson.examples?.map((example, index) => (
                        <div key={index} className="space-y-2">
                          <p><strong>Example {index + 1}:</strong></p>
                          <div className="bg-muted p-4 rounded-lg space-y-2">
                            <p><strong>Input:</strong> {example.input}</p>
                            <p><strong>Output:</strong> {example.output}</p>
                            {example.explanation && (
                              <p><strong>Explanation:</strong> {example.explanation}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="hints">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Hints</h2>
                <div className="space-y-4">
                  {isPracticeLesson && lesson.hints?.map((hint: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <p>{hint}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="solution">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h2>Solution</h2>
                    <pre><code>{isPracticeLesson && lesson.solution}</code></pre>

                    <h3>Complexity Analysis</h3>
                    <ul>
                      <li><strong>Time Complexity:</strong> {isPracticeLesson && lesson.timeComplexity}</li>
                      <li><strong>Space Complexity:</strong> {isPracticeLesson && lesson.spaceComplexity}</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Code Editor */}
        {isPracticeLesson && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="bg-background border rounded-md px-2 py-1"
                >
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <Button onClick={runCode} disabled={isRunning}>
                {isRunning ? 'Running...' : 'Run Code'}
                <PlayCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <Card className="min-h-[500px] flex flex-col">
              <div className="flex-1">
                <CodeEditor
                  initialCode={lesson.starterCode?.[selectedLanguage] || ''}
                  language={selectedLanguage}
                  onRun={handleRunCode}
                />
              </div>
            </Card>

            {output && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Output</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {output}
                </pre>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href={`/dsa/track/${params.track}`}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Track
          </Link>
        </Button>
        {nextLesson && (
          <Button asChild>
            <Link href={`/dsa/lesson/${nextLesson.track}/${nextLesson.chapter}/${nextLesson.lesson}`}>
              Next Lesson
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
} 
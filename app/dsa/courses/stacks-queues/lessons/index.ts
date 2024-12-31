import { ChapterContent } from '../../../content';

export const STACKS_QUEUES_LESSONS: Record<number, ChapterContent> = {
  0: { // Introduction to Stacks
    0: { // Stack Basics
      type: 'concept',
      title: 'Stack Data Structure',
      duration: '20 min',
      content: `# Stack Data Structure

## What is a Stack?
A stack is a linear data structure that follows the Last In First Out (LIFO) principle.

## Basic Operations
1. Push - Add element to top
2. Pop - Remove element from top
3. Peek/Top - View top element
4. isEmpty - Check if stack is empty

## Implementation
\`\`\`python
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
    
    def is_empty(self):
        return len(self.items) == 0
\`\`\`

## Common Applications
1. Function call management
2. Expression evaluation
3. Undo operations
4. Browser history

## Video Resources
1. [Stack Data Structure](https://www.youtube.com/watch?v=F1F2imiOJfk)
2. [Stack Implementation](https://www.youtube.com/watch?v=FNeL18KsWPc)`,
      examples: [
        {
          input: 'Push: 1, 2, 3\nPop twice',
          output: '3, 2 popped\n1 remains',
          explanation: 'Last In First Out principle'
        }
      ]
    },
    1: { // Stack Implementation
      type: 'practice',
      id: 'implement-stack',
      title: 'Implement a Stack',
      difficulty: 'Easy',
      description: 'Implement a stack with push, pop, peek, and isEmpty operations.',
      examples: [
        {
          input: 'push(1), push(2), pop()',
          output: '2',
          explanation: 'Last element pushed is popped first'
        }
      ],
      starterCode: {
        python: `class Stack:
    def __init__(self):
        # Initialize your stack here
        pass
    
    def push(self, item):
        # Add item to top
        pass
    
    def pop(self):
        # Remove and return top item
        pass
    
    def peek(self):
        # Return top item without removing
        pass
    
    def is_empty(self):
        # Return True if stack is empty
        pass`,
        cpp: `class Stack {
private:
    vector<int> items;
    
public:
    void push(int item) {
        // Your code here
    }
    
    int pop() {
        // Your code here
        return 0;
    }
    
    int peek() {
        // Your code here
        return 0;
    }
    
    bool isEmpty() {
        // Your code here
        return true;
    }
};`,
        java: `class Stack {
    private ArrayList<Integer> items;
    
    public Stack() {
        items = new ArrayList<>();
    }
    
    public void push(int item) {
        // Your code here
    }
    
    public int pop() {
        // Your code here
        return 0;
    }
    
    public int peek() {
        // Your code here
        return 0;
    }
    
    public boolean isEmpty() {
        // Your code here
        return true;
    }
}`
      },
      testCases: [
        {
          input: ['push(1)', 'push(2)', 'pop()'],
          output: ['0', '0', '2']
        },
        {
          input: ['is_empty()', 'push(1)', 'is_empty()'],
          output: ['true', '0', 'false']
        }
      ],
      hints: [
        'Use an array/list to store elements',
        'Track the top of stack',
        'Handle empty stack cases'
      ],
      solution: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
    
    def is_empty(self):
        return len(self.items) == 0`,
      timeComplexity: 'O(1) for all operations',
      spaceComplexity: 'O(n) where n is number of elements'
    }
  },
  1: { // Introduction to Queues
    0: { // Queue Basics
      type: 'concept',
      title: 'Queue Data Structure',
      duration: '20 min',
      content: `# Queue Data Structure

## What is a Queue?
A queue is a linear data structure that follows the First In First Out (FIFO) principle.

## Basic Operations
1. Enqueue - Add element to rear
2. Dequeue - Remove element from front
3. Front - View front element
4. isEmpty - Check if queue is empty

## Implementation
\`\`\`python
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()
    
    def front(self):
        if not self.is_empty():
            return self.items[0]
    
    def is_empty(self):
        return len(self.items) == 0
\`\`\`

## Common Applications
1. Task scheduling
2. Print queue
3. Breadth-first search
4. Message queues

## Video Resources
1. [Queue Data Structure](https://www.youtube.com/watch?v=XuCbpw6Bj1U)
2. [Queue Implementation](https://www.youtube.com/watch?v=okr-XE8yTO8)`,
      examples: [
        {
          input: 'Enqueue: 1, 2, 3\nDequeue twice',
          output: '1, 2 dequeued\n3 remains',
          explanation: 'First In First Out principle'
        }
      ]
    }
  }
}; 
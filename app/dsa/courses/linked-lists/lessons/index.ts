import { ChapterContent } from '../../../content';

export const LINKED_LISTS_LESSONS: Record<number, ChapterContent> = {
  0: { // Introduction to Linked Lists
    0: { // Linked List Basics
      type: 'concept',
      title: 'Linked List Basics',
      duration: '20 min',
      content: `# Linked List Data Structure

## What is a Linked List?
A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence.

## Types of Linked Lists
1. Singly Linked List
2. Doubly Linked List
3. Circular Linked List

## Basic Operations
- Insertion
- Deletion
- Traversal
- Search

## Implementation
\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
\`\`\`

## Video Resources
1. [Linked List Basics](https://www.youtube.com/watch?v=N3cWQnBeMog)
2. [Implementing Linked Lists](https://www.youtube.com/watch?v=njTh_OwMljA)`,
      examples: [
        {
          input: 'Create a linked list with values [1, 2, 3]',
          output: 'head -> 1 -> 2 -> 3 -> None',
          explanation: 'Each node points to the next node'
        }
      ]
    },
    1: { // Basic Operations
      type: 'practice',
      title: 'Basic Linked List Operations',
      difficulty: 'Easy',
      description: 'Implement basic operations (insert, delete, search) on a singly linked list.',
      examples: [
        {
          input: 'Insert 4 at end: [1, 2, 3]',
          output: '[1, 2, 3, 4]',
          explanation: 'New node added at the end'
        }
      ],
      starterCode: {
        python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        # Your code here
        pass
    
    def delete(self, data):
        # Your code here
        pass
    
    def search(self, data):
        # Your code here
        pass`,
        cpp: `struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
    
public:
    LinkedList() : head(nullptr) {}
    
    void append(int data) {
        // Your code here
    }
    
    void remove(int data) {
        // Your code here
    }
    
    bool search(int data) {
        // Your code here
        return false;
    }
};`,
        java: `class Node {
    int data;
    Node next;
    
    Node(int data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    Node head;
    
    public LinkedList() {
        head = null;
    }
    
    public void append(int data) {
        // Your code here
    }
    
    public void delete(int data) {
        // Your code here
    }
    
    public boolean search(int data) {
        // Your code here
        return false;
    }
}`
      },
      testCases: [
        {
          input: ['append(4)', '[1, 2, 3]'],
          output: ['[1, 2, 3, 4]']
        },
        {
          input: ['delete(2)', '[1, 2, 3]'],
          output: ['[1, 3]']
        }
      ],
      hints: [
        'Track head node carefully',
        'Handle empty list cases',
        'Update next pointers properly'
      ],
      solution: `def append(self, data):
    new_node = Node(data)
    if not self.head:
        self.head = new_node
        return
    
    current = self.head
    while current.next:
        current = current.next
    current.next = new_node`,
      timeComplexity: 'O(n) for insertion at end',
      spaceComplexity: 'O(1) for all operations'
    }
  }
}; 
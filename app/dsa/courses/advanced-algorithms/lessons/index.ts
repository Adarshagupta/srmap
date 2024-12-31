import { ChapterContent } from '../../../content';

export const ADVANCED_ALGORITHMS_LESSONS: Record<number, ChapterContent> = {
  0: { // Divide and Conquer
    0: { // Introduction
      type: 'concept',
      title: 'Divide and Conquer Strategy',
      duration: '25 min',
      content: `# Divide and Conquer Algorithms

## What is Divide and Conquer?
A strategy that solves problems by breaking them into smaller subproblems, solving them, and combining the results.

## Steps
1. **Divide**: Break problem into smaller subproblems
2. **Conquer**: Recursively solve subproblems
3. **Combine**: Merge solutions of subproblems

## Classic Examples
1. **Merge Sort**
\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

2. **Quick Sort**
\`\`\`python
def quick_sort(arr, low, high):
    if low < high:
        pivot = partition(arr, low, high)
        quick_sort(arr, low, pivot - 1)
        quick_sort(arr, pivot + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
\`\`\`

## Common Applications
1. Sorting algorithms
2. Binary search
3. Matrix multiplication
4. Closest pair of points

## Advantages
1. Efficient for large datasets
2. Parallelizable
3. Cache-friendly

## Video Resources
1. [Divide and Conquer Strategy](https://www.youtube.com/watch?v=2Rr2tW9zvRg)
2. [Merge Sort Tutorial](https://www.youtube.com/watch?v=KF2j-9iSf4Q)`,
      examples: [
        {
          input: 'merge_sort([3, 1, 4, 1, 5])',
          output: '[1, 1, 3, 4, 5]',
          explanation: 'Array sorted using divide and conquer'
        }
      ]
    },
    1: { // Merge Sort Implementation
      type: 'practice',
      title: 'Implement Merge Sort',
      difficulty: 'Medium',
      description: 'Implement the merge sort algorithm using the divide and conquer strategy.',
      examples: [
        {
          input: 'arr = [3, 1, 4, 1, 5]',
          output: '[1, 1, 3, 4, 5]',
          explanation: 'Array sorted in ascending order'
        }
      ],
      starterCode: {
        python: `def merge_sort(arr: list) -> list:
    """
    Sort array using merge sort
    
    Args:
        arr: Input array
    
    Returns:
        Sorted array
    """
    # Your code here
    pass

def merge(left: list, right: list) -> list:
    """
    Merge two sorted arrays
    
    Args:
        left: First sorted array
        right: Second sorted array
    
    Returns:
        Merged sorted array
    """
    # Your code here
    pass`,
        cpp: `vector<int> merge_sort(vector<int>& arr) {
    // Your code here
    return arr;
}

vector<int> merge(vector<int>& left, vector<int>& right) {
    // Your code here
    return vector<int>();
}`,
        java: `public int[] mergeSort(int[] arr) {
    // Your code here
    return arr;
}

public int[] merge(int[] left, int[] right) {
    // Your code here
    return new int[0];
}`
      },
      testCases: [
        {
          input: ['[3, 1, 4, 1, 5]'],
          output: [[1, 1, 3, 4, 5]]
        },
        {
          input: ['[5, 4, 3, 2, 1]'],
          output: [[1, 2, 3, 4, 5]]
        }
      ],
      hints: [
        'Divide array into two halves',
        'Recursively sort each half',
        'Merge sorted halves'
      ],
      solution: `def merge_sort(arr: list) -> list:
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left: list, right: list) -> list:
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)'
    }
  },
  1: { // Greedy Algorithms
    0: { // Introduction
      type: 'concept',
      title: 'Greedy Algorithms',
      duration: '25 min',
      content: `# Greedy Algorithms

## What are Greedy Algorithms?
Algorithms that make locally optimal choices at each step, hoping to find a global optimum.

## Characteristics
1. Makes best choice at current step
2. Never reconsiders choices
3. Simple and efficient
4. May not always find optimal solution

## Common Problems
1. **Activity Selection**
\`\`\`python
def activity_selection(start, finish):
    n = len(start)
    activities = [(start[i], finish[i]) for i in range(n)]
    activities.sort(key=lambda x: x[1])  # Sort by finish time
    
    selected = [activities[0]]
    last_finish = activities[0][1]
    
    for i in range(1, n):
        if activities[i][0] >= last_finish:
            selected.append(activities[i])
            last_finish = activities[i][1]
    
    return selected
\`\`\`

2. **Fractional Knapsack**
\`\`\`python
def fractional_knapsack(values, weights, capacity):
    n = len(values)
    items = [(values[i]/weights[i], weights[i], values[i]) 
             for i in range(n)]
    items.sort(reverse=True)  # Sort by value/weight ratio
    
    total_value = 0
    for ratio, weight, value in items:
        if capacity >= weight:
            total_value += value
            capacity -= weight
        else:
            total_value += ratio * capacity
            break
    
    return total_value
\`\`\`

## When to Use
1. Optimization problems
2. Resource allocation
3. Scheduling problems

## Advantages and Limitations
1. Simple to implement
2. Usually efficient
3. May not find optimal solution
4. Works for some problems, fails for others

## Video Resources
1. [Greedy Algorithms](https://www.youtube.com/watch?v=ARvQcqJ_-NY)
2. [Activity Selection Problem](https://www.youtube.com/watch?v=poWB2UCuozA)`,
      examples: [
        {
          input: 'start = [1, 3, 0, 5, 8, 5]\nfinish = [2, 4, 6, 7, 9, 9]',
          output: '[(1, 2), (3, 4), (5, 7), (8, 9)]',
          explanation: 'Maximum non-overlapping activities'
        }
      ]
    }
  }
}; 
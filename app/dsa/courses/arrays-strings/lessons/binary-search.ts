import { Lesson } from '../../../content';

export const BINARY_SEARCH: Lesson = {
  type: 'concept',
  title: 'Binary Search',
  duration: '30 min',
  content: `# Binary Search Algorithm

## What is Binary Search?
Binary Search is an efficient algorithm for searching a sorted array by repeatedly dividing the search interval in half.

## How it Works
1. Compare target with middle element
2. If target matches middle element, return index
3. If target is less than middle, search left half
4. If target is greater than middle, search right half
5. Repeat until target is found or determined to be absent

## Implementation
\`\`\`python
def binary_search(arr: list, target: int) -> int:
    """
    Find target in sorted array using binary search
    Returns index if found, -1 if not found
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
\`\`\`

## Time Complexity
- O(log n) - divides search space in half each time
- Much faster than linear search O(n) for large arrays

## Common Variations
1. **Finding First/Last Occurrence**
\`\`\`python
def find_first_occurrence(arr: list, target: int) -> int:
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            result = mid  # Found but continue left
            right = mid - 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
\`\`\`

2. **Binary Search on Answer Space**
- Used when searching for a value that satisfies conditions
- Common in optimization problems

## When to Use
1. Sorted array searches
2. Finding insertion position
3. Range searches
4. Optimization problems with monotonic functions

## Common Mistakes
1. Infinite loops due to incorrect mid calculation
2. Off-by-one errors in boundary conditions
3. Not handling duplicates properly
4. Using on unsorted arrays

## Video Resources
1. [Binary Search Explained](https://www.youtube.com/watch?v=P3YID7liBug)
2. [Binary Search Variations](https://www.youtube.com/watch?v=v57lNF2mb_s)
3. [Binary Search in Real Problems](https://www.youtube.com/watch?v=GU7DpgHINWQ)`,
  examples: [
    {
      input: 'arr = [1, 2, 3, 4, 5], target = 3',
      output: '2',
      explanation: 'Element 3 is found at index 2'
    },
    {
      input: 'arr = [1, 2, 2, 2, 3], target = 2',
      output: '1',
      explanation: 'First occurrence of 2 is at index 1'
    }
  ]
}; 